import { ScreenSpaceEvent, useCesium } from "resium";
import * as Cesium from "cesium";

export const PickElevationEventHandler = ({ setAddedEntity }) => {
  const { viewer, scene } = useCesium();
  const terrainProvider = viewer.terrainProvider;
  const entity = viewer.entities.add({
    label: {
      show: false,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(15, 0),
    },
  });

  const groundPickAction = async (click) => {
    const groundPosition = scene.pickPosition(click.position);
    const cartographic = Cesium.Cartographic.fromCartesian(groundPosition);
    const zIgn = await fetch(
      "https://wxs.ign.fr/calcul/alti/rest/elevation.json?lon=" +
        Cesium.Math.toDegrees(cartographic.longitude) +
        "&lat=" +
        Cesium.Math.toDegrees(cartographic.latitude)
    ).then((response) => response.json());

    Cesium.sampleTerrainMostDetailed(terrainProvider, [
      Cesium.Cartographic.fromCartesian(groundPosition),
    ]).then((newpoints) => {
      const labelPosition = {
        ...groundPosition,
        ...{ z: groundPosition["z"] + 10 },
      };

      entity.position = labelPosition;

      entity.label.show = true;
      entity.label.text =
        "Lon: " +
        ("   " + Cesium.Math.toDegrees(newpoints[0].longitude).toFixed(6)) +
        "\u00B0" +
        "\nLat: " +
        ("   " + Cesium.Math.toDegrees(newpoints[0].latitude).toFixed(6)) +
        "\u00B0" +
        "\nElevation: " +
        ("   " + newpoints[0].height.toFixed(1)) +
        "\nIGN z|acc: " +
        ("   " +
          zIgn["elevations"][0]["z"] +
          "|" +
          zIgn["elevations"][0]["acc"]);
      setAddedEntity(true);
    });
  };

  return (
    <ScreenSpaceEvent
      action={groundPickAction}
      type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
    />
  );
};
