import { Viewer, Entity, PointGraphics, EntityDescription, Scene, Globe, Camera  } from "resium";
import { useState, useRef } from "react";
import Tilesets from "./components/Tilesets"
import WmsLayers from "./components/WmsLayers"
import LayerControlContainer from "./components/LayerControlContainer"
import * as Cesium from "cesium";
import {wmsLayers, wmsUrl} from "./models/queryWMS"
import WmtsBaseLayers from './data/wmts.json'
import tileLayers from './data/tiles.json';
import {  ThemeProvider, createTheme } from '@mui/material/styles';


const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8c4e4e',
      light: '#d1a4a3',
      dark: '#4d2128',
    },
    secondary: {
      main: '#215f3b',
      light: '#7aaa90',
      dark: '#052007',
    },
  },
};

const theme = createTheme(themeOptions)
const localTerrainUrl = 'https://apgl64.geomatika.fr/releves/apgl64/terrain/test/terrain';
const terrain = await Cesium.CesiumTerrainProvider.fromUrl(localTerrainUrl);
const position = Cesium.Cartesian3.fromDegrees(-1.6522244, 43.3854383, 300);
const initVisibilityTile = {}
const addedTilesets = {}
const addedWmsLayers = {}
const wmsLayersArray = []

Object.entries(tileLayers).forEach(([k, v]) =>

{
  initVisibilityTile[k] = v['show']
}
)

wmsLayers.forEach((lyr) => {
  addedWmsLayers[lyr['Name']] = false;
  wmsLayersArray.push(lyr['Name']);
})


function App() {
  const [visibilityStateTile, setVisibilityStateTile] = useState(initVisibilityTile);
  const [visibilityStateWms, setVisibilityStateWms] = useState(addedWmsLayers);
  const [visibilityStateWmtsBaselayer, setVisibilityStateWmtsBaselayer] = useState();
  const ref = useRef(null);
  const tilesetLoaded = (name, value) => {
    addedTilesets[name] = value;
  }

  console.log('wmslyrs',wmsLayers)
  console.log('addedWmsLayers', addedWmsLayers)
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
      terrainProvider={terrain}
		  //selectionIndicator={false}
		  //infoBox={false} - this needs to be kept on because other code (not investigated deeper) depends on it. = replace with similar
      imageryProvider={false}
      //baseLayer={false}
		  geocoder= {false}
		  animation= {false}
		  timeline= {false}
      homeButton= {false}
		  fullscreenButton= {false}
		  navigationHelpButton= {false}
      //baseLayerPicker= {false}
      shadows = {Cesium.ShadowMode.DISABLED}
		  scene3DOnly= {true}
		  requestRenderMode= {false}//substitute this with true + rerender viewer ref in useeffect on visibilityState ?
		  maximumRenderTimeChange= {'Infinity'}

      >
      <Scene />

      <Globe depthTestAgainstTerrain={true}/>
      <Tilesets tileLayers={tileLayers} visibilityStateTile={visibilityStateTile} tilesetLoaded={tilesetLoaded}/>
      <WmsLayers wmsLayers={wmsLayersArray} wmsUrl={wmsUrl} visibilityStateWms={visibilityStateWms}/>
      <Camera position={position}/>



      <Entity position={position} name="Tokyo">
        <PointGraphics pixelSize={10} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
        </EntityDescription>
      </Entity>
    </Viewer>
    <LayerControlContainer 
      addedTilesets={addedTilesets} 
      visibilityStateTile={visibilityStateTile} 
      setVisibilityStateTile={setVisibilityStateTile} 
      tileLayers={tileLayers}
      addedWmsLayers={addedWmsLayers}
      visibilityStateWms={visibilityStateWms}
      setVisibilityStateWms={setVisibilityStateWms}
      viewer={ref}/>

    </ThemeProvider>
  );
}

export default App;