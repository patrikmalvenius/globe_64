import { ScreenSpaceEvent } from "resium";
import { useEffect } from "react";
import * as Cesium from "cesium";

export const MeasureEventHandler = ({ viewRef, removeMeasures }) => {
  let geodesic = new Cesium.EllipsoidGeodesic();

  let point1GeoPosition, point2GeoPosition;
  const distanceLabel = [];
  const verticalLabel = [];

  let LINEPOINTCOLOR = Cesium.Color.BLACK;
  const viewer = viewRef.current.cesiumElement;
  const scene = viewer.scene;
  const clickedPositions = [];
  let collectionCounter = 0;
  const points = [];
  const polylines = [];
  points[collectionCounter] = scene.primitives.add(
    new Cesium.PointPrimitiveCollection()
  );
  polylines[collectionCounter] = viewer.scene.primitives.add(
    new Cesium.PolylineCollection({ show: true })
  );

  const ellipsoid = scene.mapProjection.ellipsoid;
  useEffect(() => {
    const remove = () => {
      for (const point in points) {
        scene.primitives.remove(points[point]);
      }
      for (const line in polylines) {
        scene.primitives.remove(polylines[line]);
      }

      for (const label in distanceLabel) {
        viewer.entities.remove(distanceLabel[label]);
      }
      for (const label in verticalLabel) {
        viewer.entities.remove(verticalLabel[label]);
      }
      viewer.entities.remove(verticalLabel);
    };

    return remove;
  }, [removeMeasures]);

  const label = {
    font: "14px monospace",
    showBackground: true,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    pixelOffset: new Cesium.Cartesian2(0, 0),
    eyeOffset: new Cesium.Cartesian3(1, 0, -50),
    fillColor: Cesium.Color.WHITE,
  };

  const addDistanceLabel = (point1, point2, height) => {
    point1.cartographic = ellipsoid.cartesianToCartographic(point1.position);
    point2.cartographic = ellipsoid.cartesianToCartographic(point2.position);
    point1.longitude = parseFloat(Cesium.Math.toDegrees(point1.position.x));
    point1.latitude = parseFloat(Cesium.Math.toDegrees(point1.position.y));
    point2.longitude = parseFloat(Cesium.Math.toDegrees(point2.position.x));
    point2.latitude = parseFloat(Cesium.Math.toDegrees(point2.position.y));
    label.text = "Dist (hypoténuse) " + getDistanceString(point1, point2);
    distanceLabel[distanceLabel.length] = viewer.entities.add({
      position: getMidpoint(point1, point2, height),
      label: label,
    });
    label.text = "Diff Z " + getVerticalDistanceString();
    verticalLabel[verticalLabel.length] = viewer.entities.add({
      position: point2.position,
      label: label,
    });
  };

  const getVerticalDistanceString = () => {
    var meters = point2GeoPosition.height - point1GeoPosition.height;
    if (meters >= 1000) {
      return (meters / 1000).toFixed(1) + " KM";
    }
    return meters.toFixed(2) + " M";
  };

  const getDistanceString = (point1, point2) => {
    geodesic.setEndPoints(point1.cartographic, point2.cartographic);
    var horizontalMeters = geodesic.surfaceDistance.toFixed(2);
    var heights = [point1GeoPosition.height, point2GeoPosition.height];
    var verticalMeters =
      Math.max.apply(Math, heights) - Math.min.apply(Math, heights);
    var meters = Math.pow(
      Math.pow(horizontalMeters, 2) + Math.pow(verticalMeters, 2),
      0.5
    );

    if (meters >= 1000) {
      return (meters / 1000).toFixed(1) + " KM";
    }
    return meters.toFixed(2) + " M";
  };

  const getMidpoint = (point1, point2, height) => {
    var scratch = new Cesium.Cartographic();
    geodesic.setEndPoints(point1.cartographic, point2.cartographic);
    var midpointCartographic = geodesic.interpolateUsingFraction(0.5, scratch);
    return Cesium.Cartesian3.fromRadians(
      midpointCartographic.longitude,
      midpointCartographic.latitude,
      height
    );
  };

  const finishMeasureAction = () => {
    //on doubleclick -> create new primitivecollections to store the new measurements in
    collectionCounter += 1;
    points[collectionCounter] = scene.primitives.add(
      new Cesium.PointPrimitiveCollection()
    );
    polylines[collectionCounter] = viewer.scene.primitives.add(
      new Cesium.PolylineCollection({ show: true })
    );
  };

  const measureAction = (click) => {
    if (scene.mode !== Cesium.SceneMode.MORPHING) {
      var pickedObject = scene.pick(click.position);

      if (scene.pickPositionSupported) {
        var cartesian = scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
          clickedPositions.push(cartesian);

          points[collectionCounter].add({
            position: new Cesium.Cartesian3(
              cartesian.x,
              cartesian.y,
              cartesian.z
            ),
            color: LINEPOINTCOLOR,
            pixelSize: 12,
          });
          if (points[collectionCounter].length > 1) {
            let point1 = points[collectionCounter].get(
              points[collectionCounter].length - 2
            );
            let point2 = points[collectionCounter].get(
              points[collectionCounter].length - 1
            );
            point1GeoPosition = Cesium.Cartographic.fromCartesian(
              point1.position
            );
            point2GeoPosition = Cesium.Cartographic.fromCartesian(
              point2.position
            );

            let pl1Positions = [
              new Cesium.Cartesian3.fromRadians(
                point1GeoPosition.longitude,
                point1GeoPosition.latitude,
                point1GeoPosition.height
              ),
              new Cesium.Cartesian3.fromRadians(
                point2GeoPosition.longitude,
                point2GeoPosition.latitude,
                point2GeoPosition.height
              ),
            ];

            var labelZ;
            if (point2GeoPosition.height >= point1GeoPosition.height) {
              labelZ =
                point1GeoPosition.height +
                (point2GeoPosition.height - point1GeoPosition.height) / 2.0;
            } else {
              labelZ =
                point2GeoPosition.height +
                (point1GeoPosition.height - point2GeoPosition.height) / 2.0;
            }
            polylines[collectionCounter].add({
              positions: pl1Positions,
              width: 8,
              loop: false,
              material: new Cesium.Material({
                fabric: {
                  type: "Color",
                  uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
                  },
                },
              }),
            });
            addDistanceLabel(point1, point2, labelZ, point2GeoPosition.height);
          }
        }
      }
    }
  };

  return (
    <>
      <ScreenSpaceEvent
        action={measureAction}
        type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
      />
      <ScreenSpaceEvent
        action={finishMeasureAction}
        type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
      />
    </>
  );
};
