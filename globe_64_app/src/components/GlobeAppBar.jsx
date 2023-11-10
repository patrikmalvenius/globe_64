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
import AdsClickIcon from '@mui/icons-material/AdsClick';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Tooltip from '@mui/material/Tooltip';
import { useEffect } from "react";
import "../assets/searchbar.css";
import * as Cesium from 'cesium'

export default function GlobeAppBar({
  layersControlVisible,
  setLayersControlVisible,
  leftClickAction,
  setLeftClickAction,
  infoClickAction,
  setInfoClickAction,
  viewRef,
  setRemoveMeasures,
  removeMeasures,
  wmsLayers
}) {

  const onVisibilityChange = () => {
    setLayersControlVisible(!layersControlVisible);
  };
  const activateMeasureTool = () => {
    setLeftClickAction('measure')

  };
  const activateGroundPicker = () => {

    setLeftClickAction('pick')

  };
  const activateFPS = () => {

    setLeftClickAction('fps')

  };
  const activateInfo = () => {

    setLeftClickAction('info')

  };

  const eraseMeasurements = () => {
    setRemoveMeasures(removeMeasures + 1);
    //setMeasurePointLayer(null);
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ bgcolor: "grey.800" }}>
      <Tooltip title="Ouvrir contrôle de couches">
        <IconButton
          size="large"
          edge="start"
          color={layersControlVisible  ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() =>onVisibilityChange()}
        >
          <LayersIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Mesure objets 3D">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'measure' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateMeasureTool()}
        >
          <SquareFootIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>
        { leftClickAction === 'measure' ?
        <Tooltip title="Supprime mesurements">
        <IconButton
          size="small"
          edge="start"
          color= 'warning'
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => eraseMeasurements()}
        >
          <BackspaceIcon fontSize={'small'}/>
        </IconButton>
        </Tooltip> : null}
        <Tooltip title="Mesure XYZ sur terre">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'pick' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateGroundPicker()}
        >
          <ColorizeIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'fps' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateFPS()}
        >
          <TravelExploreIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Cliquez sur objets 3D pour infos">

        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'info' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => activateInfo()}
        >
          <AdsClickIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>

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
