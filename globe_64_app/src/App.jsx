import {
  Viewer,
  Entity,
  PointGraphics,
  EntityDescription,
  Scene,
  Globe,
  CameraFlyTo,
  useCesium,
  ImageryLayerCollection,
} from "resium";
import { useState, useRef, useMemo, useEffect } from "react";
import Tilesets from "./components/Tilesets";
import WmsLayers from "./components/WmsLayers";
import WmtsBaseLayer from "./components/WmtsBaseLayer";
import LayerControlContainer from "./components/LayerControlContainer";
import * as Cesium from "cesium";
import { fetchWmsLayers } from "./models/queryWMS";
import { CustomEventHandlers } from "./components/CustomEventHandlers";
import GlobeAppBar from "./components/GlobeAppBar";
//import wmtsBaseLayers from "./data/wmts.json";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#00a948",
      light: "#baf8d5",
      dark: "#008832",
    },
    secondary: {
      main: "#ef2c81",
      light: "#f8b9d3",
      dark: "#8b0055",
    },
  },
};

const theme = createTheme(themeOptions);
const localTerrainUrl =
  "https://apgl64.geomatika.fr/releves/apgl64/terrain/test/terrain";
const terrain = await Cesium.CesiumTerrainProvider.fromUrl(localTerrainUrl);
const position = Cesium.Cartesian3.fromDegrees(-0.359818, 43.309767, 300);
const initVisibilityTile = {};
const initVisibilityWmtsBaseLayers = {};
const addedTilesets = {};
const addedWmsLayers = {};
const wmsLayersArray = [];
const dummyCredit = document.createElement("div");

function App() {
  const [visibilityStateTile, setVisibilityStateTile] = useState();
  const [visibilityStateWms, setVisibilityStateWms] = useState(addedWmsLayers);
  const [layersControlVisible, setLayersControlVisible] = useState(false);
  const [visibilityStateWmtsBaselayer, setVisibilityStateWmtsBaselayer] =
    useState();
    //do we want the layers to use state? might be useful to add/remove content in client otherwise not really
  const [wmsLayers, setWmsLayers] = useState([]);
  const [wmtsBaseLayers, setWmtsBaseLayers] = useState();
  const [tileLayers, setTileLayers] = useState([]);
  const [leftClickAction, setLeftClickAction] = useState("info");
  const [removeMeasures, setRemoveMeasures] = useState(0);
  const [appConfig, setAppConfig] = useState();
  const ref = useRef(null);
  const collectionRef = useRef(null);
  const tilesetLoaded = (name, value) => {
    addedTilesets[name] = value;
  };
  const [mapConfig, setMapConfig] = useState();

  useEffect(() => {
    async function fetchConfig() {
      let urlParams = new URLSearchParams(window.location.search);
      const conf = urlParams.get("conf");
      console.log("conf", conf)
      const fetchAppConfig = await fetch("/appConfig.json");
      const result = await fetchAppConfig.json();
      conf in result ? setMapConfig(conf) : setMapConfig("standard");
      setAppConfig(result);
      console.log("mapConfig", mapConfig)
    }
    fetchConfig();
  }, []);

  useEffect(() => {
    if (appConfig) {
      async function initApp() {
        console.log("mapConfig", mapConfig)
        console.log("appConfig", appConfig)
        Object.entries(appConfig[mapConfig].basemaps).forEach(([k, v]) => {
          initVisibilityWmtsBaseLayers[k] = v["show"];
        });
        setVisibilityStateWmtsBaselayer(initVisibilityWmtsBaseLayers);
        console.log(
          "appConfig.standard.basemaps",
          appConfig[mapConfig].basemaps
        );
        setTileLayers(appConfig[mapConfig].tilesets);
        Object.entries(appConfig[mapConfig].tilesets).forEach(([k, v]) => {
          initVisibilityTile[k] = v["show"];
        });

        setWmtsBaseLayers(appConfig[mapConfig].basemaps)
        setVisibilityStateTile(initVisibilityTile);
        const layers = await fetchWmsLayers(appConfig[mapConfig]["wms"]["url"]);
        console.log("layers", layers);
        setWmsLayers((prev) => [...prev, ...layers]);
      }
      initApp();
    }
  }, [appConfig]);

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
        //ref={e => { viewer = e ? e.cesiumElement : undefined; }}
        ref={ref}
        creditContainer={dummyCredit}
        terrainProvider={terrain}
        //selectionIndicator={false}
        //infoBox={false} - this needs to be kept on because other code (not investigated deeper) depends on it. = replace with similar
        baseLayerPicker={false}
        imageryProvider={false}
        baseLayer={false}
        geocoder={false}
        //geocoder={new banGeocoder(ref)}
        animation={false}
        timeline={false}
        homeButton={false}
        fullscreenButton={false}
        navigationHelpButton={false}
        //baseLayerPicker= {false}
        //shadows={Cesium.ShadowMode.DISABLED}
        scene3DOnly={true}
        requestRenderMode={false} //substitute this with true + rerender viewer ref in useeffect on visibilityState ?
        maximumRenderTimeChange={"Infinity"}
      >
        <CustomEventHandlers
          viewRef={ref}
          leftClickAction={leftClickAction}
          setLeftClickAction={setLeftClickAction}
          removeMeasures={removeMeasures}
        ></CustomEventHandlers>
        <Scene pickTranslucentDepth={true} useDepthPicking={true} />

        <Globe depthTestAgainstTerrain={true} />

        <Tilesets
          tileLayers={tileLayers}
          visibilityStateTile={visibilityStateTile}
          tilesetLoaded={tilesetLoaded}
        />
        <ImageryLayerCollection ref={collectionRef}></ImageryLayerCollection>
        <WmsLayers
          wmsLayers={wmsLayers}
          wmsLayersArray={wmsLayersArray}
          wmsUrl={appConfig ? appConfig[mapConfig].wms.url : null}
          visibilityStateWms={visibilityStateWms}
          collectionRef={collectionRef}
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
        wmsLayers={wmsLayers}
        viewRef={ref}
      />
      {layersControlVisible ? (
        <LayerControlContainer
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
          wmsLayersArray={wmsLayersArray}
        />
      ) : null}
    </ThemeProvider>
  );
}

export default App;
