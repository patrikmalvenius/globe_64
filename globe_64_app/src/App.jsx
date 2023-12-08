import {
  Viewer,
  Scene,
  Globe,
  CameraFlyTo,
  ImageryLayerCollection,
} from "resium";
import { useState, useRef, useEffect } from "react";
import Tilesets from "./components/Tilesets";
import WmsLayers from "./components/WmsLayers";
import WmtsBaseLayer from "./components/WmtsBaseLayer";
import LayerControlContainer from "./components/LayerControlContainer";
import * as Cesium from "cesium";
import { fetchWmsLayers } from "./models/queryWMS";
import { CustomEventHandlers } from "./components/CustomEventHandlers";
import GlobeAppBar from "./components/GlobeAppBar";
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

const altThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#388E9B",
      light: "#F0F0E9",
      off: "#f6acb7",
      dark: "#423734",
    },
    secondary: {
      main: "#a6c894",
      light: "#65c3d2",
      blue: "#a6d9e1",
      dark: "#8b0055",
    },
    warning: {
      main: "#388E9B",
    },
    third: {
      main: "#388E9B",
    },
  },
};

const theme = createTheme(altThemeOptions);
const localTerrainUrl =
  "https://apgl64.geomatika.fr/releves/apgl64/terrain/test/terrain";
const terrain = await Cesium.CesiumTerrainProvider.fromUrl(localTerrainUrl);
const position = Cesium.Cartesian3.fromDegrees(-0.359818, 43.309767, 300);
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

  useEffect(() => {
    async function fetchConfig() {
      let urlParams = new URLSearchParams(window.location.search);
      const conf = urlParams.get("conf");
      const fetchAppConfig = await fetch("/appConfig.json");
      const result = await fetchAppConfig.json();
      conf in result ? setMapConfig(conf) : setMapConfig("standard");
      setAppConfig(result);
    }
    fetchConfig();
  }, []);

  useEffect(() => {
    if (appConfig) {
      async function initApp() {
        Object.entries(appConfig[mapConfig].basemaps).forEach(([k, v]) => {
          initVisibilityWmtsBaseLayers[k] = v["show"];
        });
        setVisibilityStateWmtsBaselayer(initVisibilityWmtsBaseLayers);

        setTileLayers(appConfig[mapConfig].tilesets);
        Object.entries(appConfig[mapConfig].tilesets).forEach(([k, v]) => {
          initVisibilityTile[k] = v["show"];
        });

        setWmtsBaseLayers(appConfig[mapConfig].basemaps);
        setVisibilityStateTile(initVisibilityTile);
        const layers = await fetchWmsLayers(appConfig[mapConfig]["wms"]["url"]);

        setWmsLayers(layers);
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
        terrainProvider={terrain}
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

        <Tilesets
          tileLayers={tileLayers}
          visibilityStateTile={visibilityStateTile}
          tilesetLoaded={tilesetLoaded}
        />
        <ImageryLayerCollection ref={collectionRef}></ImageryLayerCollection>
        <WmsLayers
          wmsLayers={wmsLayers}
          wmsUrl={appConfig ? appConfig[mapConfig].wms.url : null}
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
        wmsLayers={wmsLayers}
        viewRef={ref}
        addedEntity={addedEntity}
        setAddedEntity={setAddedEntity}
        eraseEntities={eraseEntities}
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
