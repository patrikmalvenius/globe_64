import { ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";

export const MeasureEventHandler = ({ viewRef }) => {
  console.log("VIEWERINMES", viewRef);
  // let  viewer, ellipsoid, scene;
  let cartographic = new Cesium.Cartographic();
  let geodesic = new Cesium.EllipsoidGeodesic();
  let points;
  let polylines;
  let point1, point2;
  let point1GeoPosition, point2GeoPosition, point3GeoPosition;

  let distanceLabel, verticalLabel, horizontalLabel;
  let LINEPOINTCOLOR = Cesium.Color.RED;
  const viewer = viewRef.current.cesiumElement;
  console.log(viewer);
  const scene = viewer.scene;
  console.log(scene);
  points = scene.primitives.add(new Cesium.PointPrimitiveCollection());
  polylines = scene.primitives.add(new Cesium.PolylineCollection());

  const ellipsoid = scene.mapProjection.ellipsoid;
  useEffect(() => {
    const remove = () => {
      scene.primitives.remove(points);
      scene.primitives.remove(polylines);
      viewer.entities.remove(distanceLabel);
      viewer.entities.remove(horizontalLabel);
      viewer.entities.remove(verticalLabel);
    };

    return remove;
  }, [points, polylines]);

  const label = {
    font: "14px monospace",
    showBackground: true,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    pixelOffset: new Cesium.Cartesian2(0, 0),
    eyeOffset: new Cesium.Cartesian3(0, 0, -50),
    fillColor: Cesium.Color.WHITE,
  };

  const addDistanceLabel = (point1, point2, height) => {
    point1.cartographic = ellipsoid.cartesianToCartographic(point1.position);
    point2.cartographic = ellipsoid.cartesianToCartographic(point2.position);
    point1.longitude = parseFloat(Cesium.Math.toDegrees(point1.position.x));
    point1.latitude = parseFloat(Cesium.Math.toDegrees(point1.position.y));
    point2.longitude = parseFloat(Cesium.Math.toDegrees(point2.position.x));
    point2.latitude = parseFloat(Cesium.Math.toDegrees(point2.position.y));
    label.text = getHorizontalDistanceString(point1, point2);
    horizontalLabel = viewer.entities.add({
      position: getMidpoint(point1, point2, point1GeoPosition.height),
      label: label,
    });
    label.text = getDistanceString(point1, point2);
    distanceLabel = viewer.entities.add({
      position: getMidpoint(point1, point2, height),
      label: label,
    });
    label.text = getVerticalDistanceString();
    verticalLabel = viewer.entities.add({
      position: getMidpoint(point2, point2, height),
      label: label,
    });
  };

  const getHorizontalDistanceString = (point1, point2) => {
    geodesic.setEndPoints(point1.cartographic, point2.cartographic);
    var meters = geodesic.surfaceDistance.toFixed(2);
    if (meters >= 1000) {
      return (meters / 1000).toFixed(1) + " KM";
    }
    return meters + " M";
  };

  const getVerticalDistanceString = () => {
    var heights = [point1GeoPosition.height, point2GeoPosition.height];
    var meters = Math.max.apply(Math, heights) - Math.min.apply(Math, heights);
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

  const measureAction = (click) => {
    console.log("scenscenscene", scene);
    console.log("points", points);

    if (scene.mode !== Cesium.SceneMode.MORPHING) {
      var pickedObject = scene.pick(click.position);
      if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
        var cartesian = scene.pickPosition(click.position);
        // console.log(cartesian);
        if (Cesium.defined(cartesian)) {
          if (points.length === 2) {
            points.removeAll();
            polylines.removeAll();
            viewer.entities.remove(distanceLabel);
            viewer.entities.remove(horizontalLabel);
            viewer.entities.remove(verticalLabel);
          }
          //add first point
          if (points.length === 0) {
            point1 = points.add({
              position: new Cesium.Cartesian3(
                cartesian.x,
                cartesian.y,
                cartesian.z
              ),
              color: LINEPOINTCOLOR,
            });
          } //add second point and lines
          else if (points.length === 1) {
            let polyline1, polyline2, polyline3;
            point2 = points.add({
              position: new Cesium.Cartesian3(
                cartesian.x,
                cartesian.y,
                cartesian.z
              ),
              color: LINEPOINTCOLOR,
            });
            point1GeoPosition = Cesium.Cartographic.fromCartesian(
              point1.position
            );
            point2GeoPosition = Cesium.Cartographic.fromCartesian(
              point2.position
            );
            point3GeoPosition = Cesium.Cartographic.fromCartesian(
              new Cesium.Cartesian3(
                point2.position.x,
                point2.position.y,
                point1.position.z
              )
            );

            var pl1Positions = [
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
            var pl2Positions = [
              new Cesium.Cartesian3.fromRadians(
                point2GeoPosition.longitude,
                point2GeoPosition.latitude,
                point2GeoPosition.height
              ),
              new Cesium.Cartesian3.fromRadians(
                point2GeoPosition.longitude,
                point2GeoPosition.latitude,
                point1GeoPosition.height
              ),
            ];
            var pl3Positions = [
              new Cesium.Cartesian3.fromRadians(
                point1GeoPosition.longitude,
                point1GeoPosition.latitude,
                point1GeoPosition.height
              ),
              new Cesium.Cartesian3.fromRadians(
                point2GeoPosition.longitude,
                point2GeoPosition.latitude,
                point1GeoPosition.height
              ),
            ];

            polyline1 = polylines.add({
              show: true,
              positions: pl1Positions,
              width: 1,
              material: new Cesium.Material({
                fabric: {
                  type: "Color",
                  uniforms: {
                    color: LINEPOINTCOLOR,
                  },
                },
              }),
            });
            polyline2 = polylines.add({
              show: true,
              positions: pl2Positions,
              width: 1,
              material: new Cesium.Material({
                fabric: {
                  type: "PolylineDash",
                  uniforms: {
                    color: LINEPOINTCOLOR,
                  },
                },
              }),
            });
            polyline3 = polylines.add({
              show: true,
              positions: pl3Positions,
              width: 1,
              material: new Cesium.Material({
                fabric: {
                  type: "PolylineDash",
                  uniforms: {
                    color: LINEPOINTCOLOR,
                  },
                },
              }),
            });
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

            addDistanceLabel(point1, point2, labelZ);
          }
        }
      }
    }
  };
  return (
    <ScreenSpaceEvent
      action={measureAction}
      type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
    />
  );
};
