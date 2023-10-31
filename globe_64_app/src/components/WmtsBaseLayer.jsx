import { ImageryLayer, ImageryLayerCollection } from "resium";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

function WmtsBaseLayers({ wmtsBaseLayers, visibilityStateWmtsBaselayer,collectionRef }) {
  useEffect(() => {
  const collection = collectionRef?.current?.cesiumElement;
  const index = 0;

 if (collection){
  const prevLayer = collection.get(index);
  collection.remove(prevLayer);
  Object.entries(wmtsBaseLayers).map((a) => {
    console.log("visibilityStateWmtsBaselayer[a[0]]", visibilityStateWmtsBaselayer[a[0]])
    if (visibilityStateWmtsBaselayer[a[0]]) {
    const imageryprovider = new Cesium.WebMapTileServiceImageryProvider({
      subdomains: ["decouverte"],
      url: a[1]["url"],
      layer: a[1]["layer"],
      format: a[1]["format"],
      maximumLevel: 20,
      tileMatrixSetID: "PM",
      style: "normal",
    });
    const layer = new Cesium.ImageryLayer(imageryprovider);
    collection.add(layer, index);
    collection.lowerToBottom(layer);

  }});}
}, [visibilityStateWmtsBaselayer, collectionRef]);
 

}
export default WmtsBaseLayers;
