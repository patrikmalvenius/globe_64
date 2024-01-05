import * as Cesium from "cesium";
import { fetchWmsLayers } from "./queryWMS";

async function fetchConfig(args) {
  const { setMapConfig, setAppConfig, setLoadProgress } = args;
  let urlParams = new URLSearchParams(window.location.search);
  const conf = urlParams.get("conf");
  const fetchAppConfig = await fetch("/appConfig.json");
  let result = await fetchAppConfig.json();
  conf in result.configs ? setMapConfig(conf) : setMapConfig("standard");
  const urlParamsWms = urlParams.get("wms");
  const urlParamsExtent = urlParams.get("extent")?.split(",");

  if (urlParamsWms) {
    if (urlParamsWms.startsWith(result.base.baseUrl)) {
      result = {
        ...result,
        ["configs"]: {
          ...result["configs"],
          ["standard"]: {
            ...result["configs"]["standard"],

            ["wms"]: {
              ...result["configs"]["standard"]["wms"],
              ["url"]: urlParamsWms,
            },
          },
        },
      };
    }
  }
  if (urlParamsExtent) {
    if (typeof urlParamsExtent === "object" && urlParamsExtent.length === 4) {
      result = {
        ...result,
        ["configs"]: {
          ...result["configs"],
          ["standard"]: {
            ...result["configs"]["standard"],

            ["startExtent"]: urlParamsExtent,
          },
        },
      };
    }
  }
  urlParamsWms || (urlParamsExtent && setMapConfig("standard"));
  setAppConfig(result);
  setLoadProgress(20);
}

async function initApp(args) {
  const {
    appConfig,
    ref,
    setLoadProgress,
    setVisibilityStateWmtsBaselayer,
    initVisibilityWmtsBaseLayers,
    mapConfig,
    setWmtsBaseLayers,
    initVisibilityTile,
    setWmsLayers,
    setGeoJsonLayers,
    setVisibilityStateGeoJson,
    setTileLayers,
    setVisibilityStateTile,
  } = args;
  const defaultExtent = [-0.363461, 43.306523, -0.355773, 43.3113];
  const extent =
    appConfig["configs"][mapConfig]["startExtent"] || defaultExtent;
  // sets extent as "home" also, should be opssibly to use this if we want a fly to home button later. otherwise quite unnecessqry really
  Cesium.Rectangle.fromDegrees(...extent, Cesium.Camera.DEFAULT_VIEW_RECTANGLE);
  ref.current.cesiumElement.scene.camera.flyTo({
    destination: Cesium.Camera.DEFAULT_VIEW_RECTANGLE,
    duration: 0,
  });
  if (appConfig["base"]["terrain"]["type"] === "local") {
    ref.current.cesiumElement.terrainProvider =
      await Cesium.CesiumTerrainProvider.fromUrl(
        appConfig["base"]["terrain"]["url"]
      );
  } else if (appConfig["base"]["terrain"]["type"] === "ion") {
    ref.current.cesiumElement.terrainProvider =
      await Cesium.CesiumTerrainProvider.fromIonAssetId(
        appConfig["base"]["terrain"]["url"]
      );
  }
  setLoadProgress(40);
  if (appConfig["configs"][mapConfig].basemaps) {
    Object.entries(appConfig["configs"][mapConfig].basemaps).forEach(
      ([k, v]) => {
        initVisibilityWmtsBaseLayers[k] = v["show"];
      }
    );
    setVisibilityStateWmtsBaselayer(initVisibilityWmtsBaseLayers);
    setWmtsBaseLayers(appConfig["configs"][mapConfig].basemaps);
  }
  setLoadProgress(60);
  if (appConfig["configs"][mapConfig].tilesets) {
    setTileLayers(appConfig["configs"][mapConfig].tilesets);
    Object.entries(appConfig["configs"][mapConfig].tilesets).forEach(
      ([k, v]) => {
        initVisibilityTile[k] = v["show"];
      }
    );

    setVisibilityStateTile(initVisibilityTile);
  }
  if (appConfig["configs"][mapConfig].wms) {
    const layers = await fetchWmsLayers(
      appConfig["configs"][mapConfig].wms.url
    );
    setLoadProgress(80);
    setWmsLayers(layers);
  }

  if (appConfig["configs"][mapConfig].geojson) {
    const geoJsonFile = await fetch(
      appConfig["configs"][mapConfig].geojson.url
    );
    let geoJson = await geoJsonFile.json();
    setGeoJsonLayers(geoJson);
    setVisibilityStateGeoJson(true);
    geoJson = null;
  }
  setLoadProgress(100);
}

export { initApp, fetchConfig };
