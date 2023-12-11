import { ScreenSpaceEventHandler } from "resium";
import { MeasureEventHandler } from "./MeasureEventHandler";
import { PickElevationEventHandler } from "./PickElevationEventHandler";
import { FpsEventHandler } from "./FpsEventHandler";
import { InfoClickEventHandler } from "./InfoClickEventHandler";
import { TakeAWalkEventHandler } from "./TakeAWalkEventHandler";
import * as Cesium from "cesium";

export const CustomEventHandlers = ({
  viewRef,
  leftClickAction,
  removeMeasures,
  setAddedEntity,
  geoJsonObj,
}) => {
  if (viewRef.current && viewRef.current.cesiumElement) {
    //not sure if i need this but felt safer
    viewRef.current.cesiumElement.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    viewRef.current.cesiumElement.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
  }
  return (
    <ScreenSpaceEventHandler>
      {leftClickAction === "fps" ? <FpsEventHandler viewRef={viewRef} /> : null}
      {leftClickAction === "measure" ? (
        <MeasureEventHandler
          viewRef={viewRef}
          removeMeasures={removeMeasures}
        />
      ) : null}
      {leftClickAction === "pick" ? (
        <PickElevationEventHandler
          viewRef={viewRef}
          setAddedEntity={setAddedEntity}
        />
      ) : null}
      {leftClickAction === "info" ? (
        <InfoClickEventHandler viewRef={viewRef} />
      ) : null}
      {leftClickAction === "walk" ? (
        <TakeAWalkEventHandler viewRef={viewRef} geoJsonObj={geoJsonObj} />
      ) : null}
    </ScreenSpaceEventHandler>
  );
};
