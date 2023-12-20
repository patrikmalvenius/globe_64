import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LayersIcon from "@mui/icons-material/Layers";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BuildIcon from "@mui/icons-material/Build";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import "../../assets/searchbar.css";

export default function GlobeAppBar({
  layersControlVisible,
  setLayersControlVisible,
  leftClickAction,
  setLeftClickAction,
  setRemoveMeasures,
  removeMeasures,
  addedEntity,
  setAddedEntity,
  eraseEntities,
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
    setLeftClickAction("measure");
  };
  const activateGroundPicker = () => {
    setLeftClickAction("pick");
  };
  const activateFPS = () => {
    setLeftClickAction("fps");
  };
  const activateInfo = () => {
    setLeftClickAction("info");
  };
  const activateWalkTool = () => {
    setLeftClickAction("walk");
  };

  const eraseMeasurements = () => {
    setRemoveMeasures(removeMeasures + 1);
  };

  const eraseAllEntites = () => {
    eraseEntities();
    setAddedEntity(false);
  };
  const theme = useTheme();
  return (
    <Toolbar color="transparent" elevation={0} variant={"dense"}>
      <Tooltip title="Ouvrir contrôle de couches">
        <IconButton
          size="large"
          edge="start"
          color={layersControlVisible ? "third" : "primary.dark"}
          aria-label="menu"
          sx={{ backgroundColor: "primary.light" }}
          onClick={() => onVisibilityChange()}
        >
          <LayersIcon fontSize={"large"} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Outils">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{ ml: 2, backgroundColor: "primary.light" }}
          aria-controls={open ? "outils-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <BuildIcon style={{ color: "primary.dark" }} fontSize={"large"} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="outils-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Tooltip title="Mesure objets 3D">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "measure" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={() => activateMeasureTool()}
            >
              <SquareFootIcon fontSize={"large"} sx={{ mr: 2 }} />
              <ListItemText primary={"Mesure objets 3D"} />
            </IconButton>
          </Tooltip>
        </MenuItem>
        <MenuItem>
          <Tooltip title="Mesure XYZ sur terre">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "pick" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={() => activateGroundPicker()}
            >
              <ColorizeIcon fontSize={"large"} sx={{ mr: 2 }} />
              <ListItemText primary={"Mesure XYZ sur terre"} />
            </IconButton>
          </Tooltip>
        </MenuItem>
        <MenuItem>
          <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "fps" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={() => activateFPS()}
            >
              <TravelExploreIcon fontSize={"large"} sx={{ mr: 2 }} />
              <ListItemText primary={"Mode FPS"} />
            </IconButton>
          </Tooltip>
        </MenuItem>
        <MenuItem>
          <Tooltip title="Take a walk">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "walk" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={() => activateWalkTool()}
            >
              <SquareFootIcon fontSize={"large"} sx={{ mr: 2 }} />
              <ListItemText primary={"Take a walk"} />
            </IconButton>
          </Tooltip>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Tooltip title="Cliquez sur objets 3D pour infos">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "info" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={() => activateInfo()}
            >
              <AdsClickIcon fontSize={"large"} sx={{ mr: 1 }} />
              <ListItemText primary={"Cliquez modèle pour infos"} />
            </IconButton>
          </Tooltip>
        </MenuItem>
      </Menu>
      {leftClickAction === "measure" ? (
        <>
          <Tooltip title="Mesure objets 3D">
            <IconButton
              size="large"
              edge="start"
              color={leftClickAction === "measure" ? "third" : "inherit"}
              aria-label="menu"
              sx={{
                ml: 2,
                backgroundColor: "primary.light",
              }}
            >
              <SquareFootIcon fontSize={"large"} sx={{ mr: 1 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprime mesurements">
            <IconButton
              size="large"
              edge="end"
              color="third"
              aria-label="menu"
              sx={{
                ml: 2,
                backgroundColor: "primary.light",
              }}
              onClick={() => eraseMeasurements()}
            >
              <BackspaceIcon fontSize={"medium"} />
            </IconButton>
          </Tooltip>{" "}
        </>
      ) : null}
      {leftClickAction === "pick" ? (
        <Tooltip title="Mesure XYZ sur terre">
          <IconButton
            size="large"
            edge="start"
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
          >
            <ColorizeIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      ) : null}
      {leftClickAction === "fps" ? (
        <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
          <IconButton
            size="large"
            edge="start"
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
          >
            <TravelExploreIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      ) : null}
      {leftClickAction === "info" ? (
        <Tooltip title="Cliquez sur objets 3D pour infos">
          <IconButton
            size="large"
            edge="start"
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
          >
            <AdsClickIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      ) : null}
      {addedEntity ? (
        <Tooltip title="Supprime">
          <IconButton
            size="large"
            edge="start"
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
            onClick={() => eraseAllEntites()}
          >
            <RemoveCircleIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      ) : null}

      <div id="globe64toolbar" sx={{ marginLeft: "auto", padding: 8 }}></div>
    </Toolbar>
  );
}
