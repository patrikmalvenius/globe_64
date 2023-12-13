import { ScreenSpaceEvent } from "resium";
import { useEffect } from "react";
import * as Cesium from "cesium";

export const TakeAWalkEventHandler = ({ viewRef, geoJsonObj }) => {
  const viewer = viewRef.current.cesiumElement;
  const updateNameOverlay = (pickedFeature, position) => {
    if (Cesium.defined(pickedFeature)) {
      console.log(pickedFeature);
    }
    // A feature was picked, so show its overlay content
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom = `${viewer.canvas.clientHeight - position.y}px`;
    nameOverlay.style.left = `${position.x}px`;
    const name = pickedFeature.getProperty("BIN");
    nameOverlay.textContent = name;
  };
  const takeAWalkAction = (click) => {
    if (Cesium.defined(click)) {
      console.log(click);
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
