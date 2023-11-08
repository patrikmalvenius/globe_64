import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useEffect } from "react";
import "../assets/searchbar.css";
import { useCesium } from "resium";

export default function GlobeAppBar({
  layersControlVisible,
  setLayersControlVisible,
  leftClickAction,
  setLeftClickAction,
  infoClickAction,
  setInfoClickAction
}) {
  const onVisibilityChange = () => {
    setLayersControlVisible(!layersControlVisible);
  };
  const activateMeasureTool = () => {
    setLeftClickAction('measure')
    console.log('measure')
    console.log(leftClickAction)
  };
  const activateGroundPicker = () => {
    setLeftClickAction('pick')
    console.log('pick')
    console.log(leftClickAction)
  };
  const activateFPS = () => {
    setLeftClickAction('fps')
    console.log('fps')
    console.log(leftClickAction)
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ bgcolor: "grey.800" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => onVisibilityChange()}
        >
          <LayersIcon />
        </IconButton>

        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateMeasureTool()}
        >
          <SquareFootIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateGroundPicker()}
        >
          <ColorizeIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateFPS()}
        >
          <TravelExploreIcon />
        </IconButton>
        <Typography
          variant="h6"
          align="center"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Globe-64
        </Typography>
        <div id="globe64toolbar"></div>
      </Toolbar>
    </AppBar>
  );
}
