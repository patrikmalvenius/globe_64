import { ScreenSpaceEventHandler } from "resium";
import { MeasureEventHandler } from "./MeasureEventHandler";
import { PickElevationEventHandler } from "./PickElevationEventHandler";
import { FpsEventHandler } from "./FpsEventHandler";
import { InfoClickEventHandler } from "./InfoClickEventHandler";
import { TakeAWalkEventHandler } from "./TakeAWalkEventHandler";

export const CustomEventHandlers = ({
  leftClickAction,
  removeMeasures,
  setAddedEntity,
  geoJsonObj,
}) => {
  return (
    <ScreenSpaceEventHandler>
      {leftClickAction === "fps" ? <FpsEventHandler /> : null}
      {leftClickAction === "measure" ? (
        <MeasureEventHandler removeMeasures={removeMeasures} />
      ) : null}
      {leftClickAction === "pick" ? (
        <PickElevationEventHandler setAddedEntity={setAddedEntity} />
      ) : null}
      {leftClickAction === "info" ? <InfoClickEventHandler /> : null}
      {leftClickAction === "walk" ? (
        <TakeAWalkEventHandler geoJsonObj={geoJsonObj} />
      ) : null}
    </ScreenSpaceEventHandler>
  );
};
