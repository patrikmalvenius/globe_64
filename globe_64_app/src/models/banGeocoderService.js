import * as Cesium from "cesium";
import proj4 from "proj4";
import { useCesium } from "resium";
proj4.defs(
  "EPSG:2154",
  "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);

function banGeocoderService() {}

/**
 * The function called to geocode using this geocoder service.
 *
 * @param {String} input The query to be sent to the geocoder service
 * @returns {Promise<GeocoderService.Result[]>}
 */

banGeocoderService.prototype.geocode = async (input) => {
  console.log(input);
  const endpoint = "https://api-adresse.data.gouv.fr/search/?q=" + input;
  const resource = new Cesium.Resource({
    url: endpoint,
    address: input,
    outputFormat: "json",
  });

  const results = await resource.fetchJson();

  //let bboxDegrees;

  return results?.features?.map((resultObject) => {
    const bboxDegrees = proj4("EPSG:2154", "EPSG:4326", [
      parseFloat(resultObject.properties.x),
      parseFloat(resultObject.properties.y),
    ]);
    return {
      displayName: resultObject.properties.label,
      destination: Cesium.Cartesian3.fromDegrees(
        bboxDegrees[0],
        bboxDegrees[1],
        25.0
      ),
    };
  });
};

export default banGeocoderService;
