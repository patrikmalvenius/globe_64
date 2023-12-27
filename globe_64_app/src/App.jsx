import {
  Viewer,
  Scene,
  Globe,
  CameraFlyTo,
  ImageryLayerCollection,
} from "resium";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Tilesets from "./components/layers/Tilesets";
import WmsLayers from "./components/layers/WmsLayers";
import WmtsBaseLayer from "./components/layers/WmtsBaseLayer";
import Geojsons from "./components/layers/Geojsons";
import LayerControlContainer from "./components/controls/LayerControlContainer";
import * as Cesium from "cesium";
import { fetchWmsLayers } from "./models/queryWMS";
import { CustomEventHandlers } from "./components/eventhandlers/CustomEventHandlers";
import GlobeAppBar from "./components/controls/GlobeAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import VirtualWalkEntity from "./components/layers/VirtualWalkEntity";
import { themeOptions } from "./styles/theme";

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
  const collectionRef = useRef(null);
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
      <Viewer
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        ref={ref}
        creditContainer={dummyCredit}
        terrainProvider={undefined}
        //infoBox={false} - this needs to be kept on because other code (not investigated deeper) depends on it. = replace with similar
        baseLayerPicker={false}
        imageryProvider={false}
        baseLayer={false}
        geocoder={false}
        animation={false}
        timeline={false}
        homeButton={false}
        fullscreenButton={false}
        navigationHelpButton={false}
        scene3DOnly={true}
        requestRenderMode={false} //substitute this with true + rerender viewer ref in useeffect on visibilityState ?
        maximumRenderTimeChange={"Infinity"}
      >
        <CustomEventHandlers
          viewRef={ref}
          leftClickAction={leftClickAction}
          setLeftClickAction={setLeftClickAction}
          removeMeasures={removeMeasures}
          setAddedEntity={setAddedEntity}
        ></CustomEventHandlers>
        <Scene
          pickTranslucentDepth={true}
          useDepthPicking={true}
          sun={new Cesium.Sun()}
          skyAtmosphere={new Cesium.SkyAtmosphere()}
        />

        <Globe depthTestAgainstTerrain={true} />
        {walk ? (
          <VirtualWalkEntity
            viewRef={ref}
            rCoords={rCoords}
            setWalk={setWalk}
          />
        ) : null}
        <Tilesets
          tileLayers={tileLayers}
          visibilityStateTile={visibilityStateTile}
          tilesetLoaded={tilesetLoaded}
        />
        <Geojsons
          geoJsonLayers={geoJsonLayers}
          visibilityStateGeoJson={visibilityStateGeoJson}
          setWalk={setWalk}
          setRCoords={setRCoords}
        />

        <ImageryLayerCollection ref={collectionRef}></ImageryLayerCollection>
        <WmsLayers
          wmsUrl={appConfig ? appConfig["configs"][mapConfig].wms.url : null}
          visibilityStateWms={visibilityStateWms}
          collectionRef={collectionRef}
          setAddedEntity={setAddedEntity}
        />
        <WmtsBaseLayer
          wmtsBaseLayers={wmtsBaseLayers}
          visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
          collectionRef={collectionRef}
        />
        <CameraFlyTo
          destination={
            new Cesium.Cartesian3(
              4648690.8089348255,
              -29158.155070096756,
              4352934.020068386
            )
          }
          once={true}
        />
      </Viewer>
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
