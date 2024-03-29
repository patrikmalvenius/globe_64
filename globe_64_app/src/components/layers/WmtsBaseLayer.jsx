import { useEffect } from "react";
import * as Cesium from "cesium";

function WmtsBaseLayers({
  wmtsBaseLayers,
  visibilityStateWmtsBaselayer,
  collectionRef,
}) {
  useEffect(() => {
    const collection = collectionRef?.current?.cesiumElement;
    const index = 0;

    if (collection && visibilityStateWmtsBaselayer && wmtsBaseLayers) {
      const prevLayer = collection.get(index);
      collection.remove(prevLayer);
      Object.entries(wmtsBaseLayers).map((a) => {
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
        }
      });
    }
  }, [visibilityStateWmtsBaselayer, collectionRef, wmtsBaseLayers]);
}
export default WmtsBaseLayers;
