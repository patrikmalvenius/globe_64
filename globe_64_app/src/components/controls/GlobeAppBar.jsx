import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BuildIcon from "@mui/icons-material/Build";
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
  showToolMenu,
  setShowToolMenu,
  helpTableVisible,
  setHelpTableVisible,
  handleClick,
  onVisibilityChange,
}) {
  const open = Boolean(showToolMenu);

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
          color={showToolMenu ? "third" : "primary.dark"}
          sx={{ ml: 2, backgroundColor: "primary.light" }}
          aria-controls={open ? "outils-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <BuildIcon style={{ color: "primary.dark" }} fontSize={"large"} />
        </IconButton>
      </Tooltip>

      {leftClickAction === "measure" ? (
        <>
          <Tooltip title="Mesure objets 3D">
            <IconButton
              size="large"
              edge="start"
              disableRipple={true}
              color={leftClickAction === "measure" ? "third" : "inherit"}
              aria-label="menu"
              sx={{ ml: 2, backgroundColor: "primary.light", cursor: "auto" }}
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
            disableRipple={true}
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light", cursor: "auto" }}
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
            disableRipple={true}
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light", cursor: "auto" }}
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
            disableRipple={true}
            color={"third"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light", cursor: "auto" }}
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
