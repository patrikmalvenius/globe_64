import * as Cesium from "cesium";
import banGeocoderService from "./banGeocoderService";

//const container = document.getElementsByClassName("cesium-viewer-toolbar")[0];
const banGeocoder = function (container) {
  return new Cesium.Geocoder({
    container: 'document.getElementsByClassName("cesium-viewer-toolbar")[0]',
    geocoderServices: [banGeocoderService],
  });
};

export default banGeocoder;
