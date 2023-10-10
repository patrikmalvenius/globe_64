import * as Cesium from "cesium";

function banGeocoder() {}

/**
 * The function called to geocode using this geocoder service.
 *
 * @param {String} input The query to be sent to the geocoder service
 * @returns {Promise<GeocoderService.Result[]>}
 */

banGeocoder.prototype.geocode = async (input) => {
  console.log(input);
  const endpoint =  'https://api-adresse.data.gouv.fr/search/?q=' +input;
  const resource = new Cesium.Resource({
    url: endpoint,
    address : input,
    outputFormat: 'json',
  });

  const results = await resource.fetchText();
  console.log(results.toString());
    let bboxDegrees;
    return results?.map(resultObject => {
      console.log(resultObject);
      bboxDegrees = [
        parseFloat(resultObject.lon),
        parseFloat(resultObject.lat)
      ];
      return {
        displayName: resultObject.display_name,
        destination: Cesium.Cartesian3.fromDegrees(
          // No matter which line below is used, after searching a location
          // camera end position is always the same height as long as
          // createWorldTerrain() is used in the viewer as terrainProvider:

          // bboxDegrees[0], bboxDegrees[1], 0.0
          bboxDegrees[0], bboxDegrees[1], 50.0
          // bboxDegrees[0], bboxDegrees[1], 15000.0
          // bboxDegrees[0], bboxDegrees[1], 50000.0
        ),
      };
    });
};

export default banGeocoder;