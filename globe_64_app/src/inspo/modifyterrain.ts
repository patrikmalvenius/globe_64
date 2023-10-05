import { Request, TerrainData, Rectangle } from 'cesium';
import * as turf from '@turf/turf';
import { Feature, Polygon } from '@turf/turf';

const MAX_SHORT = 32767;

interface ModelEdit {
  polygon: Feature<Polygon>;
  polygonTriangles: Feature<Polygon>[]; // TIN algorithm result on polygon
}

export class TerrainProviderEdit extends Cesium.CesiumTerrainProvider {
  private modelEdits: ModelEdit[] = [];

  constructor({ url, modelEdits }: { url: string; modelEdits: ModelEdit[] }) {
    super({ url });

    this.modelEdits = modelEdits;
  }

  requestTileGeometry(x: number, y: number, level: number, request: Request): Promise<TerrainData> | undefined {
    const promise = super.requestTileGeometry(x, y, level, request);
    if (!promise || this.modelEdits.length === 0) {
      return promise;
    }

    const tileRectangle: Rectangle = this.tilingScheme.tileXYToRectangle(x, y, level);
    const tilePolygon = GeoUtils.rectangleToPolygon(tileRectangle);  // Create turf polygon from tile rectangle
    const relevantEdits = this.modelEdits.filter(
      edit => turf.booleanOverlap(edit.polygon, tilePolygon) || turf.booleanContains(edit.polygon, tilePolygon)
    );
    if (relevantEdits.length === 0) {
      return promise;
    }

    return promise.then((data: TerrainData) => this.modifyTerrainTile(data, tileRectangle, relevantEdits));
  }

  private modifyTerrainTile(terrainData: TerrainData, tileRectangle: Rectangle, modelEdits: ModelEdit[]) {
    const data = terrainData as any;
    const minimumHeight = data._minimumHeight;
    const maximumHeight = data._maximumHeight;

    const quantizedVertices: Uint16Array = data._quantizedVertices;
    const vertexCount = quantizedVertices.length / 3;

    const positions: number[][] = [];
    for (let i = 0; i < vertexCount; i++) {
      const rawU = quantizedVertices[i];
      const rawV = quantizedVertices[i + vertexCount];
      const rawH = quantizedVertices[i + vertexCount * 2];

      const u = rawU / MAX_SHORT;
      const v = rawV / MAX_SHORT;
      const longitude = Cesium.Math.toDegrees(Cesium.Math.lerp(tileRectangle.west, tileRectangle.east, u));
      const latitude = Cesium.Math.toDegrees(Cesium.Math.lerp(tileRectangle.south, tileRectangle.north, v));

      let height = Cesium.Math.lerp(minimumHeight, maximumHeight, rawH / MAX_SHORT);
      const currentPoint = turf.point([longitude, latitude]);
      const relevantEdit = modelEdits.find(edit => turf.booleanPointInPolygon(currentPoint, edit.polygon));
      if (relevantEdit) {
        const relevantTriangle = relevantEdit.polygonTriangles.find(triangle =>
          turf.booleanPointInPolygon(currentPoint, triangle)
        );
        if (relevantTriangle) {
          height = turf.planepoint(currentPoint, relevantTriangle);
        }
      }
      positions.push([longitude, latitude, height]);
    }

    // TODO: split mesh triangles that are crossing the user polygon's perimiter and recreate mesh

    const heights = positions.map(p => p[2]);
    const newMinHeight = Math.min(...heights);
    const newMaxHeight = Math.max(...heights);

    const newQuantizedVertices = new Uint16Array(positions.length * 3);
    positions.forEach((p, i) => {
      const lonRad = Cesium.Math.toRadians(p[0]);
      newQuantizedVertices[i] = Math.round(
        Cesium.Math.lerp(MAX_SHORT, 0, (lonRad - tileRectangle.east) / (tileRectangle.west - tileRectangle.east))
      );

      const latRad = Cesium.Math.toRadians(p[1]);
      newQuantizedVertices[i + positions.length] = Math.round(
        Cesium.Math.lerp(MAX_SHORT, 0, (latRad - tileRectangle.north) / (tileRectangle.south - tileRectangle.north))
      );

      const relativeHeight = Math.round(
        Cesium.Math.lerp(0, MAX_SHORT, (p[2] - newMinHeight) / (newMaxHeight - newMinHeight))
      );
      newQuantizedVertices[i + positions.length * 2] = relativeHeight;
    });

    data._minimumHeight = newMinHeight;
    data._maximumHeight = newMaxHeight;
    data._quantizedVertices = newQuantizedVertices;

    return data as TerrainData;
  }
}