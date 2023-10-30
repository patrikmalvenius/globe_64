import { ImageryLayerCollection, ImageryLayer, useCesium } from "resium";
import { memo, useEffect, useRef } from "react";
import * as Cesium from "cesium";

function WmsLayers({ wmsUrl, visibilityStateWms, collectionRef }) {
  //hack based on https://github.com/reearth/resium/issues/634
  //only known (to me) way to recharge layers for the moment
  const { viewer } = useCesium();
  //ref instead of useCesium?
  useEffect(() => {
    const mapProjection = viewer.scene.mapProjection;
    const ellipsoid = mapProjection.ellipsoid;

    viewer.geocoder.viewModel.destinationFound = function (
      viewModel,
      destination
    ) {
      const destinationCartographic =
        ellipsoid.cartesianToCartographic(destination);
      const destZoomTo = ellipsoid.cartographicToCartesian({
        ...destinationCartographic,
        ...{ height: destinationCartographic["height"] + 300 },
      });
      const destMarker = ellipsoid.cartographicToCartesian({
        ...destinationCartographic,
        ...{ height: destinationCartographic["height"] + 60 },
      });

      console.log(
        "destination:",
        ellipsoid.cartesianToCartographic(destination)
      );
      viewer.camera.flyTo({
        destination: destZoomTo,
      });
      console.log("Going to", viewModel.searchText);
      viewer.entities.removeById("searchresult");
      viewer.entities.add({
        name: viewModel.searchText,
        position: destMarker,
        id: "searchresult",
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: viewModel.searchText,
          font: "14pt monospace",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
        },
      });
    };
  }, []);

  //const collectionRef = useRef();
  useEffect(() => {
    const visibleLayers = {};
    Object.keys(visibilityStateWms).forEach(
      (k) => visibilityStateWms[k] && (visibleLayers[k] = visibilityStateWms[k])
    );
    const layers = Object.keys(visibleLayers).join();
    const collection = collectionRef?.current?.cesiumElement;
    console.log("collection", collection)
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

  return <></>;
}

export default WmsLayers;
