import { ImageryLayer } from "resium";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

function WmtsBaseLayers({ wmtsBaseLayers, visibilityStateWmtsBaselayer }) {
  const wmtsbaselayers = Object.entries(wmtsBaseLayers).map((a) => {
    console.log("WMTS", a);
    const imageryprovider = new Cesium.WebMapTileServiceImageryProvider({
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
  return wmtsbaselayers;
}

export default WmtsBaseLayers;
