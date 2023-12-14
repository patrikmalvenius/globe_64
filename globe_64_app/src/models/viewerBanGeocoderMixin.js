import * as Cesium from "cesium";
import banGeocoderService from "./banGeocoderService";

function viewerBanGeocoderMixin(viewer, opts) {
  const mapProjection = viewer.scene.mapProjection;
  const ellipsoid = mapProjection.ellipsoid;
  const destinationFound = function (viewModel, destination) {
    console.log("viewModel", viewModel);
    console.log("destination", destination);

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

    viewer.camera.flyTo({
      destination: destZoomTo,
      complete: () => {
        viewer.entities.removeById("searchresult");

        viewer.entities.add({
          name: viewModel.searchText,
          position: destMarker,
          id: "searchresult",
          billboard: {
            scale: 0.8,
            image: "localhost:8888/data/icones/adressage.svg",
            color: Cesium.Color.RED,
            verticalOrigin: 1,
          },
          label: {
            text: viewModel.searchText,
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.GHOSTWHITE,
            outlineColor: Cesium.Color.DARKSLATEGREY,
            outlineWidth: 8,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -60),
          },
        });
        opts.setAddedEntity(true);
      },
    });
  };
  const banGeocoder = new Cesium.Geocoder({
    container: "globe64toolbar",
    geocoderServices: [new banGeocoderService()],
    scene: viewer.scene,
    autoComplete: true,
    destinationFound: destinationFound,
  });
  const oldDestroyFunction = viewer.destroy;
  viewer.destroy = function () {
    oldDestroyFunction.apply(viewer, arguments);
    banGeocoder.destroy();
  };

  Object.defineProperties(viewer, {
    banGeocoder: {
      get: function () {
        return banGeocoder;
      },
    },
    banGeocoderService: {
      get: function () {
        return banGeocoderService;
      },
    },
  });
}

export default viewerBanGeocoderMixin;
