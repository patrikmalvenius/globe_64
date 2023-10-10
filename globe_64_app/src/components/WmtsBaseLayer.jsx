import { ImageryLayer, ImageryLayerCollection } from "resium";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

function WmtsBaseLayers({ wmtsBaseLayers, visibilityStateWmtsBaselayer }) {
  const wmtsbaselayers = Object.entries(wmtsBaseLayers).map((a) => {
    const imageryprovider = new Cesium.WebMapTileServiceImageryProvider({
      subdomains: ["decouverte"],
      url: a[1]["url"],
      layer: a[1]["layer"],
      format: a[1]["format"],
      maximumLevel: 20,
      tileMatrixSetID: "PM",
      style: "normal",
    });
    return (
      <ImageryLayer
        key={a[0]}
        show={visibilityStateWmtsBaselayer[a[0]]}
        imageryProvider={imageryprovider}
      />
    );
  });
  return <ImageryLayerCollection> {wmtsbaselayers}</ImageryLayerCollection>;
}

export default WmtsBaseLayers;
