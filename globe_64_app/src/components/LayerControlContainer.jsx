import { useState, useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LayerControlTabPanel from "./LayerControlTabPanel";
import TilesetLayerControl from "./TilesetLayerControl";
import WmsLayerControl from "./WmsLayerControl";
import WmtsBaseLayerControl from "./WmtsBaseLayerControl";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function LayerControlContainer({
  visibilityStateTile,
  setVisibilityStateTile,
  tileLayers,
  viewer,
  addedTilesets,
  addedWmsLayers,
  setAddedWmsLayers,
  visibilityStateWms,
  setVisibilityStateWms,
  setVisibilityStateWmtsBaselayer,
  visibilityStateWmtsBaselayer,
  wmtsBaseLayers,
  wmsLayers,
  appConfig,
  setAppConfig,
  mapConfig,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        width: "20%",
        minWidth: "400px",
        position: "absolute",
        border: 2,
        bgcolor: "primary.light",
        borderColor: "primary.dark",
        borderRadius: 1,
      }}
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

      <LayerControlTabPanel value={value} index={1}>
        {wmsLayers ? (
          <WmsLayerControl
            addedWmsLayers={addedWmsLayers}
            setAddedWmsLayers={setAddedWmsLayers}
            setVisibilityStateWms={setVisibilityStateWms}
            visibilityStateWms={visibilityStateWms}
            appConfig={appConfig}
            mapConfig={mapConfig}
            setAppConfig={setAppConfig}
          />
        ) : (
          <Typography>Les couches WMS ne sont pas encore chargées</Typography>
        )}
      </LayerControlTabPanel>
      <LayerControlTabPanel value={value} index={2}>
        <WmtsBaseLayerControl
          setVisibilityStateWmtsBaselayer={setVisibilityStateWmtsBaselayer}
          visibilityStateWmtsBaselayer={visibilityStateWmtsBaselayer}
          wmtsBaseLayers={wmtsBaseLayers}
        />
      </LayerControlTabPanel>
    </Box>
  );
}
export default LayerControlContainer;
