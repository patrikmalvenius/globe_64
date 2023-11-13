import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LayersIcon from "@mui/icons-material/Layers";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AdsClickIcon from '@mui/icons-material/AdsClick';
import BackspaceIcon from '@mui/icons-material/Backspace';
import BuildIcon from '@mui/icons-material/Build';
import Menu from '@mui/material/Menu';
import ListItemText from "@mui/material/ListItemText";
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
        <Tooltip title="Outils">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'outils-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <BuildIcon style={{ color: 'white' }} fontSize={'large'}/>
          </IconButton>
        </Tooltip>        

        <Menu
        anchorEl={anchorEl}
        id="outils-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
        <Tooltip title="Mesure objets 3D">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'measure' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 1 }}
          onClick={() => activateMeasureTool()}
        >
          <SquareFootIcon fontSize={'large'}   sx={{ mr: 2 }}/>
          <ListItemText  primary={"Mesure objets 3D"} />

        </IconButton>
        </Tooltip>

        </MenuItem>
        <MenuItem>
        <Tooltip title="Mesure XYZ sur terre">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'pick' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 1 }}
          onClick={() => activateGroundPicker()}
        >
          <ColorizeIcon fontSize={'large'}   sx={{ mr: 2 }}/>
          <ListItemText  primary={"Mesure XYZ sur terre"} />
        </IconButton>
        </Tooltip>
        </MenuItem>
        <MenuItem>
        <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'fps' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 1 }}
          onClick={() => activateFPS()}
        >
          <TravelExploreIcon fontSize={'large'}   sx={{ mr: 2 }}/>
          <ListItemText  primary={"Mode FPS"} />
        </IconButton>
        </Tooltip>
        </MenuItem>
        <Divider />
        <MenuItem>
        <Tooltip title="Cliquez sur objets 3D pour infos">

        <IconButton
          size="large"
          edge="start"
          color={leftClickAction === 'info' ? 'warning':'inherit'}
          aria-label="menu"
          sx={{ mr: 1 }}
          onClick={() => activateInfo()}
        >
          <AdsClickIcon fontSize={'large'}   sx={{ mr: 1 }}/>
          <ListItemText  primary={"Cliquez modèle pour infos"} />
        </IconButton>
        </Tooltip>
        </MenuItem>
      </Menu>
      { leftClickAction === 'measure' ?
        <Tooltip title="Supprime mesurements">
        <IconButton
          size="small"
          edge="end"
          color= 'warning'
          aria-label="menu"
          sx={{ ml: 4 }}
          onClick={() => eraseMeasurements()}
        >
          <BackspaceIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip> : null}



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

