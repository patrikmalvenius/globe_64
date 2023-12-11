import { GeoJsonDataSource } from "resium";
import * as Cesium from "cesium";

function Geojsons({ geoJsonLayers, visibilityStateGeoJson, viewRef }) {
  let geojsons;

  if (visibilityStateGeoJson) {
    geojsons = geoJsonLayers.features.map((a) => {
      return (
        <GeoJsonDataSource
          data={a}
          show={visibilityStateGeoJson}
          key={a["id"]}
          clampToGround={true}
          onLoad={(g) => {
            console.log("gggggggggggggggggggggggggggggggggggggggg", g);
            const entities = g.entities.values;

            for (let i = 0; i < entities.length; i++) {
              const entity = entities[i];
              entity.polyline.classificationType =
                Cesium.ClassificationType.TERRAIN;
            }
            3;
            40;
          }}
          onClick={(e, t) => {
            console.log(e);
            console.log(t);
            console.log(t.primitive);
            console.log(t.id.properties.getValue(new Cesium.JulianDate()));
            console.log(t.id.properties.getValue(new Cesium.JulianDate()).id);
            console.log(geoJsonLayers);
          }}
        />
      );
    });
  }
  return geojsons;
}

export default Geojsons;
