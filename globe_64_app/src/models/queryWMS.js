import WMSCapabilities from "ol/format/WMSCapabilities.js";
import wmsUrls from "../data/wms.json";

const parser = new WMSCapabilities();
async function fetchWmsLayers(url) {
  const layers = await fetch(url + "&SERVICE=WMS&REQUEST=GetCapabilities")
    .then(async function (response) {
      return response.text();
    })
    .then(function (text) {
      const result = parser.read(text);
      return result;
    })
    .then(function (wmsCapabilities) {
      return wmsCapabilities["Capability"]["Layer"]["Layer"];
    });
  return layers;
}

const wmsUrl = wmsUrls["wms_1"]["url"];

export { fetchWmsLayers, wmsUrl };
