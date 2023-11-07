import { ImageryLayerCollection, ImageryLayer, useCesium } from "resium";
import { memo, useEffect, useRef } from "react";
import * as Cesium from "cesium";
import viewerBanGeocoderMixin from "../models/viewerBanGeocoderMixin";
function WmsLayers({ wmsUrl, visibilityStateWms, collectionRef }) {
  //hack based on https://github.com/reearth/resium/issues/634
  //only known (to me) way to recharge layers for the moment
  const { viewer } = useCesium();
  //ref instead of useCesium? och kanske flytta skiten till bättre ställe?
  useEffect(() => {
    viewer.extend(viewerBanGeocoderMixin);
  }, []);

  useEffect(() => {
    const visibleLayers = {};
    Object.keys(visibilityStateWms).forEach(
      (k) => visibilityStateWms[k] && (visibleLayers[k] = visibilityStateWms[k])
    );
    const layers = Object.keys(visibleLayers).join();
    const collection = collectionRef?.current?.cesiumElement;
    console.log("collection", collection);
    if (collection) {
      const index = 1;
      const prevLayer = collection.get(index);
      collection.remove(prevLayer);
      if (layers) {
        const newLayer = new Cesium.WebMapServiceImageryProvider({
          url: wmsUrl,
          layers: layers,
          srs: "EPSG:4326",
          parameters: {
            TRANSPARENT: true,
            FORMAT: "image/png",
          },
        });
        collection.add(new Cesium.ImageryLayer(newLayer, index));
      }
    }
  }, [visibilityStateWms, collectionRef]);
}

export default WmsLayers;
