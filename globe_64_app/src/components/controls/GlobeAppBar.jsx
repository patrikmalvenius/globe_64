import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import LayersIcon from "@mui/icons-material/Layers";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BuildIcon from "@mui/icons-material/Build";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import HelpTable from "./HelpTable";
import "../../assets/searchbar.css";
import HelpIcon from "@mui/icons-material/Help";

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
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [helpTableVisible, setHelpTableVisible] = useState(false);
  const open = Boolean(showToolMenu);
  const handleClick = () => {
    setShowToolMenu(!showToolMenu);
  };

  const onVisibilityChange = () => {
    setLayersControlVisible(!layersControlVisible);
  };
  const showHelpTable = () => {
    setHelpTableVisible(!helpTableVisible);
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
          color={showToolMenu ? "third" : "primary.dark"}
          sx={{ ml: 2, backgroundColor: "primary.light" }}
          aria-controls={open ? "outils-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <BuildIcon style={{ color: "primary.dark" }} fontSize={"large"} />
        </IconButton>
      </Tooltip>
      {showToolMenu ? (
        <ClickAwayListener onClickAway={handleClick}>
          <Box
            sx={{
              width: "20%",
              minWidth: "400px",
              position: "absolute",
              border: 2,
              bgcolor: "primary.light",
              borderColor: "primary.dark",
              borderRadius: 1,
              mt: 70,
            }}
            onClick={handleClick}
          >
            {" "}
            <List
              sx={{
                width: "100%",
                bgcolor: "primary.light",

                maxHeight: 500,
                overflowY: "auto",
                overflowX: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  sx={{
                    bgcolor: "primary.light",
                  }}
                >
                  Outils
                </ListSubheader>
              }
            >
              {" "}
              <ListItem key={"aidenav"} dense>
                <Tooltip title="Aide navigation">
                  <IconButton
                    onClick={showHelpTable}
                    size="large"
                    color="primary.dark"
                    edge="start"
                    sx={{ mr: 1 }}
                    aria-controls={open ? "outils-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <HelpIcon
                      style={{ color: "primary.dark" }}
                      fontSize={"large"}
                      sx={{ mr: 2 }}
                    />
                    <ListItemText primary={"Aide navigation"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <ListItem key={"mesure"} dense>
                <Tooltip title="Mesure objets 3D">
                  <IconButton
                    size="large"
                    edge="start"
                    color={
                      leftClickAction === "measure" ? "third" : "primary.dark"
                    }
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => activateMeasureTool()}
                  >
                    <SquareFootIcon fontSize={"large"} sx={{ mr: 2 }} />
                    <ListItemText primary={"Mesure objets 3D"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <ListItem key={"mesureterre"} dense>
                <Tooltip title="Mesure XYZ sur terre">
                  <IconButton
                    size="large"
                    edge="start"
                    color={
                      leftClickAction === "pick" ? "third" : "primary.dark"
                    }
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => activateGroundPicker()}
                  >
                    <ColorizeIcon fontSize={"large"} sx={{ mr: 2 }} />
                    <ListItemText primary={"Mesure XYZ sur terre"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <ListItem key={"fps"} dense>
                <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
                  <IconButton
                    size="large"
                    edge="start"
                    color={leftClickAction === "fps" ? "third" : "primary.dark"}
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => activateFPS()}
                  >
                    <TravelExploreIcon fontSize={"large"} sx={{ mr: 2 }} />
                    <ListItemText primary={"Mode FPS"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <ListItem key={"walk"} dense>
                <Tooltip title="Take a walk">
                  <IconButton
                    size="large"
                    edge="start"
                    color={
                      leftClickAction === "walk" ? "third" : "primary.dark"
                    }
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => activateWalkTool()}
                  >
                    <SquareFootIcon fontSize={"large"} sx={{ mr: 2 }} />
                    <ListItemText primary={"Take a walk"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider />
              <ListItem key={"info"} dense>
                <Tooltip title="Cliquez sur objets 3D pour infos">
                  <IconButton
                    size="large"
                    edge="start"
                    color={
                      leftClickAction === "info" ? "third" : "primary.dark"
                    }
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => activateInfo()}
                  >
                    <AdsClickIcon fontSize={"large"} sx={{ mr: 1 }} />
                    <ListItemText primary={"Cliquez modèle pour infos"} />
                  </IconButton>
                </Tooltip>
              </ListItem>
            </List>
          </Box>
        </ClickAwayListener>
      ) : null}
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

      <HelpTable
        helpTableVisible={helpTableVisible}
        setHelpTableVisible={setHelpTableVisible}
      />
    </Toolbar>
  );
}
