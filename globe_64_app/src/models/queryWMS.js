import WMSCapabilities from 'ol/format/WMSCapabilities.js';
import wmsUrls from '../data/wms.json';

const parser = new WMSCapabilities();
const wmsCapabilities = await fetch(wmsUrls['wms_1']['url']+'&SERVICE=WMS&REQUEST=GetCapabilities')
  .then(async function (response) {
    return response.text();
  })
  .then(function (text) {
    const result = parser.read(text);
    return result
  });

const wmsLayers = wmsCapabilities['Capability']['Layer']['Layer'];
const wmsUrl = wmsUrls['wms_1']['url']

export {wmsLayers, wmsUrl};
 