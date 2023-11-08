import { ScreenSpaceEvent, ScreenSpaceEventHandler } from "resium";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";

export const FpsEventHandler = ({ leftClick, viewRef, setLeftClick }) => {
  let viewer;
  let scene;
  let screenSpaceCameraController;
  let camera;
  let cartographic = new Cesium.Cartographic();
  let ellipsoid;

  useEffect(() => {
    viewer = viewRef.current.cesiumElement;
    scene = viewRef.current.cesiumElement.scene;
    screenSpaceCameraController = scene.screenSpaceCameraController;
    camera = scene.camera;
    cartographic = new Cesium.Cartographic();
    ellipsoid = scene.mapProjection.ellipsoid;
  }, []);

  const enterClick = (click) => {
    if (click.position !== undefined) {
      const height = Cesium.Cartographic.fromCartesian(
        scene.pickPosition(click.position)
      ).height.toFixed(1);

      if (height > 1) {
        const position = scene.pickPosition(click.position);
        if (position !== undefined) {
          camera.flyTo({
            destination: Cesium.Cartesian3.fromElements(
              position.x,
              position.y,
              Number(position.z) + 1.8
            ),
            orientation: {
              heading: Cesium.Math.toRadians(
                Cesium.Math.toDegrees(camera.heading).toFixed(2)
              ),
              pitch: Cesium.Math.toRadians(0),
            },
          });
          if (camera.frustum.fov < Cesium.Math.toRadians(75)) {
            toFPS();
          }
        }
      } else {
        const position = camera.pickEllipsoid(click.position, ellipsoid);
        if (position !== undefined) {
          const cartographic = ellipsoid.cartesianToCartographic(position);
          const longitude = Cesium.Math.toDegrees(cartographic.longitude);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude);
          const height = scene.globe.getHeight(cartographic);
          camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              longitude,
              latitude,
              height + 1.8
            ),
            orientation: {
              heading: Cesium.Math.toRadians(
                Cesium.Math.toDegrees(camera.heading).toFixed(2)
              ),
              pitch: Cesium.Math.toRadians(0),
            },
          });
          if (camera.frustum.fov < Cesium.Math.toRadians(75)) {
            toFPS();
          }
        }
      }
    }
  };

  const exitClick = (click) => {
    camera.moveStart.removeEventListener(stopRolling);
    camera.moveEnd.removeEventListener(stopRolling);
    if (camera.frustum.fov > Cesium.Math.toRadians(75)) {
      const from = 90;
      const to = 60;
      const duration = 2000;
      const start = new Date().getTime();

      const timer = setInterval(function () {
        const time = new Date().getTime() - start;
        const x = easeInOutQuart(time, from, to - from, duration);
        camera.frustum.fov = Cesium.Math.toRadians(x);
        if (time >= duration) clearInterval(timer);
      }, 1000 / 60);

      screenSpaceCameraController.enableRotate = true;
      screenSpaceCameraController.enableTranslate = true;
      screenSpaceCameraController.enableZoom = true;
      screenSpaceCameraController.enableTilt = true;
      screenSpaceCameraController.enableLook = false;
      screenSpaceCameraController.rotateEventTypes = [
        Cesium.CameraEventType.LEFT_DRAG,
      ];

      ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);

      const lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
      const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
      const height = cartographic.height.toFixed(2);
      const heading = Cesium.Math.toDegrees(camera.heading).toFixed(2);
      const pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(2);

      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          lng,
          lat,
          Number(height) + 30
        ),
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(-20),
        },
      });
    }
  };
  const easeInOutQuart = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  };

  const stopRolling = () => {
    camera.setView({
      orientation: { heading: camera.heading, pitch: camera.pitch, roll: 0.0 },
    });
  };
  const toFPS = () => {
    screenSpaceCameraController.enableRotate = false;
    screenSpaceCameraController.enableTranslate = false;
    screenSpaceCameraController.enableZoom = false;
    screenSpaceCameraController.enableTilt = false;
    screenSpaceCameraController.enableLook = true;
    screenSpaceCameraController.lookEventTypes = [
      Cesium.CameraEventType.LEFT_DRAG,
    ];

    camera.moveStart.addEventListener(stopRolling);
    camera.moveEnd.addEventListener(stopRolling);

    setTimeout(function () {
      const from = 60;
      const to = 90;
      const duration = 2000;
      const start = new Date().getTime();

      const timer = setInterval(function () {
        const time = new Date().getTime() - start;
        const x = easeInOutQuart(time, from, to - from, duration);
        camera.frustum.fov = Cesium.Math.toRadians(x);
        if (time >= duration) clearInterval(timer);
      }, 1000 / 60);
    }, 1000);
  };
  return (
    <>
      <ScreenSpaceEvent
        action={enterClick}
        type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
      />
      <ScreenSpaceEvent
        action={exitClick}
        type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
      />
    </>
  );
};
