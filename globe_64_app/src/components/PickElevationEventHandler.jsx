import { ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";


export const PickElevationEventHandler = ({viewRef}) => {

const terrainProvider = viewRef.current.cesiumElement.terrainProvider;
const scene =  viewRef.current.cesiumElement.scene;
const entity = viewRef.current.cesiumElement.entities.add({
    label: {
        show: false,
        showBackground: true,
        font: "14px monospace",
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(15, 0)
    },
});
const groundPickAction = (click) => {

const groundPosition = scene.pickPosition(click.position);
console.log("groundPosition", groundPosition)
    Cesium.sampleTerrainMostDetailed(terrainProvider, [Cesium.Cartographic.fromCartesian(groundPosition)]).then((newpoints) =>{
        const labelPosition = {...groundPosition, ...{z:groundPosition['z']+50}}
        console.log("labelPosition", labelPosition)
        console.log("newpoints",newpoints)
        entity.position = labelPosition;
        entity.label.show = true;
        entity.label.text =
            "Lon: " +
            ("   " + newpoints[0].longitude) +
            "\u00B0" +
            "\nLat: " +
            ("   " + newpoints[0].latitude) +
            "\u00B0" +
            "\nElevation: " +
            ("   " + newpoints[0].height);
    });

        }

        return   (<ScreenSpaceEvent action={groundPickAction} type={Cesium.ScreenSpaceEventType.LEFT_CLICK} />)}
