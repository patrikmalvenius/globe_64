import { ScreenSpaceEvent } from "resium";

import * as Cesium from "cesium";


export const InfoClickEventHandler = ({infoClickAction}) => {


return   (<ScreenSpaceEvent action={infoClickAction} type={Cesium.ScreenSpaceEventType.LEFT_CLICK} />)}
