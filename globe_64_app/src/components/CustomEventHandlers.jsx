import { ScreenSpaceEventHandler } from "resium";
import { MeasureEventHandler } from "./MeasureEventHandler";
import { PickElevationEventHandler } from "./PickElevationEventHandler";
import { FpsEventHandler } from "./FpsEventHandler";
import { useEffect, useState } from "react";

export const CustomEventHandlers = ({ viewRef }) => {
  const [leftClick, setLeftClick] = useState();

  return (
    <ScreenSpaceEventHandler>
      <FpsEventHandler
        viewRef={viewRef}
        leftClick={leftClick}
        setLiftClick={setLeftClick}
      />
      <MeasureEventHandler viewRef={viewRef} />
      <PickElevationEventHandler viewRef={viewRef} />
    </ScreenSpaceEventHandler>
  );
};
