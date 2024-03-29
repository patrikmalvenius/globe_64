import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LayerControlTabPanel from "./LayerControlTabPanel";
import TilesetLayerControl from "./TilesetLayerControl";
import WmsLayerControl from "./WmsLayerControl";
import WmtsBaseLayerControl from "./WmtsBaseLayerControl";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import { Typography } from "@mui/material";

function LayerControlContainer({
  visibilityStateTile,
  setVisibilityStateTile,
  tileLayers,
  viewer,
  addedTilesets,
  visibilityStateWms,
  setVisibilityStateWms,
  setVisibilityStateWmtsBaselayer,
  visibilityStateWmtsBaselayer,
  wmtsBaseLayers,
  loadProgress,
  appConfig,
  setAppConfig,
  mapConfig,
  setLayersControlVisible,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };
  const handleClickAway = () => {
    setLayersControlVisible(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          width: "30%",
          height: "100%",
          minWidth: "350px",
          position: "relative",
          border: 2,
          bgcolor: "primary.light",
          borderColor: "secondary.light",
          borderRadius: 1,
          mt: 2,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="globe tabs">
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
          {loadProgress > 80 ? (
            <WmsLayerControl
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
    </ClickAwayListener>
  );
}
export default LayerControlContainer;
