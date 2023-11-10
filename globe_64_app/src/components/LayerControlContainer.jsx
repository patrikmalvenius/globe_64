import { useState, useReducer, useEffect } from "react";
import { useCesium } from "resium";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LayerControlTabPanel from "./LayerControlTabPanel";
import TilesetLayerControl from "./TilesetLayerControl";
import WmsLayerControl from "./WmsLayerControl";
import WmtsBaseLayerControl from "./WmtsBaseLayerControl";
function LayerControlContainer({
  visibilityStateTile,
  setVisibilityStateTile,
  tileLayers,
  viewer,
  addedTilesets,
  addedWmsLayers,
  visibilityStateWms,
  setVisibilityStateWms,
  setVisibilityStateWmtsBaselayer,
  visibilityStateWmtsBaselayer,
  wmtsBaseLayers,
  wmsLayers,
  wmsLayersArray
}) {
  wmsLayers ? 
  wmsLayers.forEach((lyr) => {
    addedWmsLayers[lyr["Name"]] = false;
    wmsLayersArray.push(lyr["Name"]);
  }) : null;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };
  //if (wmsLayers) {
  return  ( 
    <Box
      sx={{ width: "20%", bgcolor: "background.paper", position: "absolute" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="3Dtiles" />
          <Tab label="2D" />
          <Tab label="Fond de plan" />
        </Tabs>
      </Box>
      <LayerControlTabPanel value={value} index={0}>
        <TilesetLayerControl
          addedTilesets={addedTilesets}
          setVisibilityStateTile={setVisibilityStateTile}
          visibilityStateTile={visibilityStateTile}
          tileLayers={tileLayers}
          viewer={viewer}
        />
      </LayerControlTabPanel>
      { wmsLayers ? 
      <LayerControlTabPanel value={value} index={1}>
        <WmsLayerControl
          addedWmsLayers={addedWmsLayers}
          setVisibilityStateWms={setVisibilityStateWms}
          visibilityStateWms={visibilityStateWms}
        /> 
      </LayerControlTabPanel>: null}
      <LayerControlTabPanel value={value} index={2}>
        <WmtsBaseLayerControl
          setVisibilityStateWmtsBaselayer={setVisibilityStateWmtsBaselayer}
          visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
          wmtsBaseLayers={wmtsBaseLayers}
        />
      </LayerControlTabPanel>
    </Box>)

}
export default LayerControlContainer;
