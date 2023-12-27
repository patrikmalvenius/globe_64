import { Cesium3DTileset, GeoJsonDataSource } from "resium";
import * as Cesium from "cesium";
const bUrl = "http://localhost:8888/data/tiles/";

function Tilesets({
  tileLayers,

  visibilityStateTile,
  tilesetLoaded,
}) {
  let tilesets;
  if (visibilityStateTile) {
    tilesets = Object.entries(tileLayers).map((a) => {
      return (
        <Cesium3DTileset
          key={a[0]}
          url={bUrl + a[1]["assetid"]}
          showOutline={true}
          show={visibilityStateTile[a[0]]}
          maximumScreenSpaceError={4}
          onReady={(e) => {
            tilesetLoaded([a[0]], e);
            if (a[1].translatez) {
              const heightOffset = a[1].translatez;
              const boundingSphere = e.boundingSphere;
              const cartographic = Cesium.Cartographic.fromCartesian(
                boundingSphere.center
              );
              const surface = Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                0.0
              );
              const offset = Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                heightOffset
              );
              const translation = Cesium.Cartesian3.subtract(
                offset,
                surface,
                new Cesium.Cartesian3()
              );
              e.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            }
            if (a[1].type === "lidar") {
              console.log("LIIIIIIIDAR");
              //e.pointCloudShading.attenuation = true;
              //e.pointCloudShading.maximumAttenuation = 2;
              //e.pointCloudShading.baseResolution = 1;
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", e);
              e.style = new Cesium.Cesium3DTileStyle({
                pointSize: "3",
              });
            }
          }}
        />
      );
    });

    return tilesets;
  }
}

export default Tilesets;
