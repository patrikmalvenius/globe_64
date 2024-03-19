import { useState, useRef, useEffect } from "react";
import LayerControlContainer from "./components/controls/LayerControlContainer";
import GlobeToolMenu from "./components/controls/GlobeToolMenu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeOptions } from "./styles/theme";
import ViewerComponent from "./components/viewer";
import TimeControl from "./components/controls/TimeControls";
import HelpTable from "./components/controls/HelpTable";
import { initApp, fetchConfig } from "./models/initApp";
import Grid from "@mui/material/Grid";
import ChangeAppConfigControl from "./components/controls/ChangeAppConfigControl";

const theme = createTheme(themeOptions);
const initVisibilityTile = {};
const initVisibilityWmtsBaseLayers = {};
//we keep this collection in order to have easy access to the added tilesets for flyto and other operations
//possible we could replace this with an array of id:s ?
const addedTilesets = {};
const dummyCredit = document.createElement("div");

function App() {
  //wmsLayers = array with the layers we get from getCapabilities on the WMS
  //we change the contents here when we change WMS url in app
  const [wmsLayers, setWmsLayers] = useState([]);
  //array to hold list of all available configs
  const [allConfigs, setAllConfigs] = useState([]);

  //visibilityStateWms = holds the state of the added wmslayers (visible/not visible)
  //we change the contents here when we change WMS url in app
  const [visibilityStateWms, setVisibilityStateWms] = useState({});
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

  const [loadProgress, setLoadProgress] = useState(0);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [helpTableVisible, setHelpTableVisible] = useState(false);
  const [configTableVisible, setConfigTableVisible] = useState(false);
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
  const [timeControlVisible, setTimeControlVisible] = useState(false);
  const handleClick = () => {
    setShowToolMenu(!showToolMenu);
  };

  const onVisibilityChange = () => {
    setLayersControlVisible(!layersControlVisible);
  };
  useEffect(() => {
    fetchConfig({ setMapConfig, setAppConfig, setLoadProgress, setAllConfigs });
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
  }, [mapConfig]);

  useEffect(() => {
    let tempWmsLayers = {};
    wmsLayers.forEach((lyr) => {
      tempWmsLayers[lyr["Name"]] = false;
    });
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
        wmtsBaseLayers={wmtsBaseLayers}
        visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
        appConfig={appConfig}
        mapConfig={mapConfig}
        dummyCredit={dummyCredit}
        ref={ref}
      ></ViewerComponent>

      <Grid container direction="column" spacing={0}>
        <Grid container item direction="row" spacing={1} xs={6}>
          <GlobeToolMenu
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
            loadProgress={loadProgress}
            timeControlVisible={timeControlVisible}
            setTimeControlVisible={setTimeControlVisible}
            allConfigs={allConfigs}
            configTableVisible={configTableVisible}
            setConfigTableVisible={setConfigTableVisible}
          />
        </Grid>
        <Grid item xs={11}>
          {layersControlVisible && (
            <LayerControlContainer
              setLayersControlVisible={setLayersControlVisible}
              addedTilesets={addedTilesets}
              visibilityStateTile={visibilityStateTile}
              setVisibilityStateTile={setVisibilityStateTile}
              tileLayers={tileLayers}
              loadProgress={loadProgress}
              visibilityStateWms={visibilityStateWms}
              setVisibilityStateWms={setVisibilityStateWms}
              viewer={ref}
              setVisibilityStateWmtsBaselayer={setVisibilityStateWmtsBaselayer}
              visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
              wmtsBaseLayers={wmtsBaseLayers}
              appConfig={appConfig}
              mapConfig={mapConfig}
              setAppConfig={setAppConfig}
            />
          )}
          {helpTableVisible && (
            <HelpTable
              helpTableVisible={helpTableVisible}
              setHelpTableVisible={setHelpTableVisible}
            />
          )}
          {timeControlVisible && (
            <TimeControl
              timeControlVisible={timeControlVisible}
              setTimeControlVisible={setTimeControlVisible}
            />
          )}
          {configTableVisible && (
            <ChangeAppConfigControl
              configTableVisible={configTableVisible}
              setConfigTableVisible={setConfigTableVisible}
              allConfigs={allConfigs}
              setMapConfig={setMapConfig}
              mapConfig={mapConfig}
            />
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
