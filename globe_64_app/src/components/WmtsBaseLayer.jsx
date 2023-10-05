import {  ImageryLayerCollection } from "resium";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";


function WmtsBaseLayers({wmtsUrl, visibilityStateWmts}) {
    //hack based on https://github.com/reearth/resium/issues/634
    //only known (to me) way to recharge layers for the moment
    const collectionRef = useRef();
    useEffect(() => {
        const visibleLayers = {};
        Object.keys(visibilityStateWms).forEach(k => visibilityStateWms[k] && (visibleLayers[k] = visibilityStateWms[k]));
        const layers = Object.keys(visibleLayers).join()
        const collection = collectionRef?.current?.cesiumElement;
        if (collection) {
          const index = 1
          const prevLayer = collection.get(index);
          collection.remove(prevLayer);
        if (layers) {
          const newLayer = new Cesium.WebMapTileServiceImageryProvider({
            url: wmsUrl,
            layers: layers,
            srs: 'EPSG:4326',
            parameters: {
                TRANSPARENT: true,
                FORMAT: 'image/png'
            }})
          collection.add(new Cesium.ImageryLayer(newLayer, index));
        }}
      }, [visibilityStateWms, collectionRef]);

    return (
          <ImageryLayerCollection   
          ref={collectionRef} />
        );
      
}

export default WmtsBaseLayers;