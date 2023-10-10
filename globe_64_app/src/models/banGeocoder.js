import * as Cesium from "cesium";
import banGeocoderService from "./banGeocoderService";

//const container = document.getElementsByClassName("cesium-viewer-toolbar")[0];
const banGeocoder = function (viewer) {
  if (viewer.current && viewer.current.cesiumElement) {
    return new Cesium.Geocoder({
      container: 'document.getElementsByClassName("cesium-viewer-toolbar")[0]',
      geocoderServices: [banGeocoderService],
    });
  } else {
    console.log("Viewer not available");
  }
};

export default banGeocoder;
