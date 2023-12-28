import { useState, useRef, useEffect, forwardRef } from "react";

import LayerControlContainer from "./components/controls/LayerControlContainer";
import * as Cesium from "cesium";
import { fetchWmsLayers } from "./models/queryWMS";
import GlobeAppBar from "./components/controls/GlobeAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeOptions } from "./styles/theme";
import ViewerComponent from "./components/viewer";

const theme = createTheme(themeOptions);

const initVisibilityTile = {};
const initVisibilityWmtsBaseLayers = {};
const addedTilesets = {};

const dummyCredit = document.createElement("div");

function App() {
  //wmsLayers = array with the layers we get from getCapabilities on the WMS
  //we change the contents here when we change WMS url in app
  const [wmsLayers, setWmsLayers] = useState([]);
  //addedwmslayers = object used to initialize the wmslayercontainer for on/off
  // and  visibilityStateWms
  //we change the contents here when we change WMS url in app
  const [addedWmsLayers, setAddedWmsLayers] = useState({});
  //visibilityStateWms = holds the state of the added wmslayers (visible/not visible)
  const [visibilityStateWms, setVisibilityStateWms] = useState(addedWmsLayers);
  const [visibilityStateTile, setVisibilityStateTile] = useState();
  const [layersControlVisible, setLayersControlVisible] = useState(false);
  const [visibilityStateWmtsBaselayer, setVisibilityStateWmtsBaselayer] =
    useState();
  const [wmtsBaseLayers, setWmtsBaseLayers] = useState();
  const [tileLayers, setTileLayers] = useState([]);
  const [leftClickAction, setLeftClickAction] = useState("info");
  const [removeMeasures, setRemoveMeasures] = useState(0);
  //
  const [appConfig, setAppConfig] = useState();
  const [geoJsonLayers, setGeoJsonLayers] = useState();
  const [visibilityStateGeoJson, setVisibilityStateGeoJson] = useState();
  const ref = useRef(null);
  const wmsCollectionRef = useRef(null);
  const wmtsCollectionRef = useRef(null);

  const tilesetLoaded = (name, value) => {
    addedTilesets[name] = value;
  };
  //we use this to track if we have added entities by searching, measuring etc
  //if we have addedEntity, we show button to delete all addedEntities
  const [addedEntity, setAddedEntity] = useState(false);
  //do we want mapconfig to use state? might be useful if we want to change config in app otherwise not really
  const [mapConfig, setMapConfig] = useState();
  const [walk, setWalk] = useState(false);
  const [rCoords, setRCoords] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      let urlParams = new URLSearchParams(window.location.search);
      const conf = urlParams.get("conf");
      const fetchAppConfig = await fetch("/appConfig.json");
      const result = await fetchAppConfig.json();
      conf in result.configs ? setMapConfig(conf) : setMapConfig("standard");
      setAppConfig(result);
    }
    fetchConfig();
  }, []);

  useEffect(() => {
    if (appConfig) {
      async function initApp() {
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

        if (appConfig["configs"][mapConfig].basemaps) {
          Object.entries(appConfig["configs"][mapConfig].basemaps).forEach(
            ([k, v]) => {
              initVisibilityWmtsBaseLayers[k] = v["show"];
            }
          );
          setVisibilityStateWmtsBaselayer(initVisibilityWmtsBaseLayers);
          setWmtsBaseLayers(appConfig["configs"][mapConfig].basemaps);
        }

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

          setWmsLayers(layers);
        }

        if (appConfig["configs"][mapConfig].geojson) {
          const geoJsonFile = await fetch(
            appConfig["configs"][mapConfig].geojson.url
          );
          let geoJson = await geoJsonFile.json();
          console.log("geoJsongeoJsongeoJsongeoJsongeoJson", geoJson);
          setGeoJsonLayers(geoJson);
          setVisibilityStateGeoJson(true);
          geoJson = null;
        }
        const defaultExtent = [-0.363461, 43.306523, -0.355773, 43.3113];
        const extent =
          appConfig["configs"][mapConfig]["startExtent"] || defaultExtent;

        Cesium.Rectangle.fromDegrees(
          ...extent,
          Cesium.Camera.DEFAULT_VIEW_RECTANGLE
        );
      }
      initApp();
    }
  }, [appConfig]);

  useEffect(() => {
    let tempWmsLayers = {};
    wmsLayers.forEach((lyr) => {
      tempWmsLayers[lyr["Name"]] = false;
    });
    setAddedWmsLayers(tempWmsLayers);
    setVisibilityStateWms(tempWmsLayers);
  }, [wmsLayers]);

  const eraseEntities = () => {
    ref.current.cesiumElement
      ? ref.current.cesiumElement.entities.removeAll()
      : null;
  };
  return (
    <ThemeProvider theme={theme}>
      <ViewerComponent
        leftClickAction={leftClickAction}
        setLeftClickAction={setLeftClickAction}
        removeMeasures={removeMeasures}
        setAddedEntity={setAddedEntity}
        rCoords={rCoords}
        setWalk={setWalk}
        walk={walk}
        tileLayers={tileLayers}
        visibilityStateTile={visibilityStateTile}
        tilesetLoaded={tilesetLoaded}
        geoJsonLayers={geoJsonLayers}
        visibilityStateGeoJson={visibilityStateGeoJson}
        setRCoords={setRCoords}
        visibilityStateWms={visibilityStateWms}
        wmsCollectionRef={wmtsCollectionRef}
        wmtsCollectionRef={wmsCollectionRef}
        wmtsBaseLayers={wmtsBaseLayers}
        visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
        appConfig={appConfig}
        mapConfig={mapConfig}
        dummyCredit={dummyCredit}
        ref={ref}
      ></ViewerComponent>

      <GlobeAppBar
        layersControlVisible={layersControlVisible}
        setLayersControlVisible={setLayersControlVisible}
        setLeftClickAction={setLeftClickAction}
        leftClickAction={leftClickAction}
        setRemoveMeasures={setRemoveMeasures}
        removeMeasures={removeMeasures}
        addedEntity={addedEntity}
        setAddedEntity={setAddedEntity}
        eraseEntities={eraseEntities}
      />
      {layersControlVisible ? (
        <LayerControlContainer
          setLayersControlVisible={setLayersControlVisible}
          addedTilesets={addedTilesets}
          visibilityStateTile={visibilityStateTile}
          setVisibilityStateTile={setVisibilityStateTile}
          tileLayers={tileLayers}
          wmsLayers={wmsLayers}
          visibilityStateWms={visibilityStateWms}
          setVisibilityStateWms={setVisibilityStateWms}
          viewer={ref}
          setVisibilityStateWmtsBaselayer={setVisibilityStateWmtsBaselayer}
          visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
          wmtsBaseLayers={wmtsBaseLayers}
          addedWmsLayers={addedWmsLayers}
          setAddedWmsLayers={setAddedWmsLayers}
          appConfig={appConfig}
          mapConfig={mapConfig}
          setAppConfig={setAppConfig}
        />
      ) : null}
    </ThemeProvider>
  );
}

export default App;
