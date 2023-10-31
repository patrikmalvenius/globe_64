import { ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";


export const PickElevationEventHandler = ({viewRef}) => {

const terrainProvider = viewRef.current.cesiumElement.terrainProvider;
const scene =  viewRef.current.cesiumElement.scene;

const groundPickAction = (click) => {

const groundPosition = scene.pickPosition(click.position);

    Cesium.sampleTerrainMostDetailed(terrainProvider, [Cesium.Cartographic.fromCartesian(groundPosition)]).then((newpoints) =>{

        console.log("newpoints",newpoints)
    });

        }

        return   (<ScreenSpaceEvent action={groundPickAction} type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}  modifier={Cesium.KeyboardEventModifier.SHIFT}/>)}
