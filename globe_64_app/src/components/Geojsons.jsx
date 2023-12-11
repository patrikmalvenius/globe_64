import { GeoJsonDataSource } from "resium";
import * as Cesium from "cesium";

function Geojsons({ geoJsonLayers, visibilityStateGeoJson }) {
  let geojsons;

  if (visibilityStateGeoJson) {
    console.log("geoJsonLayersgeoJsonLayersgeoJsonLayers", geoJsonLayers);
    geojsons = geoJsonLayers.features.map((a) => {
      return (
        <GeoJsonDataSource
          data={a}
          key={a["id"]}
          clampToGround={true}
          onLoad={(g) => {
            console.log("ggggggg", g);
            const entities = g.entities.values;
            for (let i = 0; i < entities.length; i++) {
              const entity = entities[i];
              console.log("entityentityentity", entity);
              entity.polyline.classificationType =
                Cesium.ClassificationType.TERRAIN;
            }
            3;
            40;
          }}
        />
      );
    });
  }
  return geojsons;
}

export default Geojsons;
