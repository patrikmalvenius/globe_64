import { useState, useRef, useEffect } from "react";
import LayerControlContainer from "./components/controls/LayerControlContainer";
import GlobeAppBar from "./components/controls/GlobeAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeOptions } from "./styles/theme";
import ViewerComponent from "./components/viewer";
import LoadIndicator from "./components/stuff/loadIndicator";
import ToolMenu from "./components/controls/ToolMenuContainer";
import HelpTable from "./components/controls/HelpTable";
import { initApp, fetchConfig } from "./models/initApp";

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
  const [loadProgress, setLoadProgress] = useState(0);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [helpTableVisible, setHelpTableVisible] = useState(false);
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
  const handleClick = () => {
    setShowToolMenu(!showToolMenu);
  };

  const onVisibilityChange = () => {
    setLayersControlVisible(!layersControlVisible);
  };
  useEffect(() => {
    fetchConfig({ setMapConfig, setAppConfig, setLoadProgress });
  }, []);

  useEffect(() => {
    if (appConfig) {
      initApp({
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
      });
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
        showToolMenu={showToolMenu}
        setShowToolMenu={setShowToolMenu}
        helpTableVisible={helpTableVisible}
        setHelpTableVisible={setHelpTableVisible}
        handleClick={handleClick}
        onVisibilityChange={onVisibilityChange}
      />
      {layersControlVisible ? (
        <LayerControlContainer
          setLayersControlVisible={setLayersControlVisible}
          addedTilesets={addedTilesets}
          visibilityStateTile={visibilityStateTile}
          setVisibilityStateTile={setVisibilityStateTile}
          tileLayers={tileLayers}
          wmsLayers={wmsLayers}
          loadProgress={loadProgress}
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
      {showToolMenu ? (
        <ToolMenu
          setLeftClickAction={setLeftClickAction}
          handleClick={handleClick}
          showToolMenu={showToolMenu}
          setShowToolMenu={setShowToolMenu}
          setHelpTableVisible={setHelpTableVisible}
          helpTableVisible={helpTableVisible}
        />
      ) : null}
      {helpTableVisible ? (
        <HelpTable
          helpTableVisible={helpTableVisible}
          setHelpTableVisible={setHelpTableVisible}
        />
      ) : null}

      {loadProgress < 100 && <LoadIndicator loadProgress={loadProgress} />}
    </ThemeProvider>
  );
}

export default App;
