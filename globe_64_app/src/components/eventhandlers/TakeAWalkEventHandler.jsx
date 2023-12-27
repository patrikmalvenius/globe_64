import { ScreenSpaceEvent } from "resium";
import * as Cesium from "cesium";

//not used yet, walkaction tied to click on geojson
export const TakeAWalkEventHandler = ({ viewRef, geoJsonObj }) => {
  const viewer = viewRef.current.cesiumElement;

  const takeAWalkAction = (click) => {
    if (Cesium.defined(click)) {
      console.log("CLICKWALKEVENT", click);
      const pickedFeature = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedFeature)) {
        console.log(pickedFeature);
        if (pickedFeature.primitive instanceof Cesium.GroundPolylinePrimitive) {
          console.log("is groundpolyprim");
          const pathId = pickedFeature.id.properties.id;
          const pathName = pickedFeature.id.properties.nom;
          console.log(pathId, pathName);
          console.log(geoJsonObj);
          console.log(
            geoJsonObj.getById(pickedFeature.id.properties.id._value)
          );
        }
      }
    }
  };
  const finishWalkingAction = () => {};
  return (
    <>
      <ScreenSpaceEvent
        action={takeAWalkAction}
        type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
      />
      <ScreenSpaceEvent
        action={finishWalkingAction}
        type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
      />
    </>
  );
};
