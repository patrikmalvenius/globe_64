import { ScreenSpaceEventHandler } from "resium";
import { MeasureEventHandler } from "./MeasureEventHandler";
import { PickElevationEventHandler } from "./PickElevationEventHandler";
import { FpsEventHandler } from "./FpsEventHandler";
import { InfoClickEventHandler } from "./InfoClickEventHandler";
import { useEffect, useState } from "react";
import * as Cesium from 'cesium'

export const CustomEventHandlers = ({ viewRef, leftClickAction, setLeftClickAction,  infoClickAction, setInfoClickAction }) => {
console.log("leftClickAction", leftClickAction)
if (viewRef.current && viewRef.current.cesiumElement) {
//not sure if i need this but felt safer
  viewRef.current.cesiumElement.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
  return (
    <ScreenSpaceEventHandler>
      {leftClickAction === 'fps' ?
      <FpsEventHandler
        viewRef={viewRef}
      /> : null }
      {leftClickAction === 'measure' ?
      <MeasureEventHandler viewRef={viewRef} /> : null }
      {leftClickAction === 'pick' ?
      <PickElevationEventHandler viewRef={viewRef} /> : null}
      {leftClickAction === 'info' ?
      <InfoClickEventHandler infoClickAction={infoClickAction}/> : null}
    </ScreenSpaceEventHandler>
  );
};
