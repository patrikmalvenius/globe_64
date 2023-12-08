import { ScreenSpaceEvent } from "resium";
import { useEffect } from "react";
import * as Cesium from "cesium";

export const TakeAWalkEventHandler = ({ viewRef }) => {
  const takeAWalkAction = () => {};

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
