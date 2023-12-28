// from https://stackoverflow.com/questions/61522983/cesium-move-camera-to-view-entity-if-not-visible

// lat, lng, height defined
const cartographic = Cesium.Cartographic.fromDegrees(lng, lat, height);
if (
  !Cesium.Rectangle.contains(map.camera.computeViewRectangle(), cartographic)
) {
  const destination = Cesium.Cartesian3.fromDegrees(lng, lat, height);
  map.camera.flyTo({ destination, duration: 0.5 });
}
