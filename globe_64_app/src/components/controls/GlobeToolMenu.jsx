import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import LayersIcon from "@mui/icons-material/Layers";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import BuildIcon from "@mui/icons-material/Build";
import LoadIndicator from "../stuff/loadIndicator";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import "../../assets/searchbar.css";

export default function GlobeToolMenu({
  layersControlVisible,
  leftClickAction,
  setLeftClickAction,
  setRemoveMeasures,
  removeMeasures,
  addedEntity,
  setAddedEntity,
  eraseEntities,
  loadProgress,
  helpTableVisible,
  setHelpTableVisible,
  onVisibilityChange,
  timeControlVisible,
  setTimeControlVisible,
  allConfigs,
  setConfigTableVisible,
  configTableVisible,
}) {
  const [showToolMenu, setShowToolMenu] = useState(false);
  const eraseMeasurements = () => {
    setRemoveMeasures(removeMeasures + 1);
  };

  const eraseAllEntites = () => {
    eraseEntities();
    setAddedEntity(false);
  };
  const theme = useTheme();

  const showHelpTable = () => {
    setHelpTableVisible(!helpTableVisible);
  };

  const showConfigTable = () => {
    setConfigTableVisible(!configTableVisible);
  };

  const showTimeControl = () => {
    setTimeControlVisible(!timeControlVisible);
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

  const activateToolMenu = () => {
    setShowToolMenu(!showToolMenu);
  };

  console.log("allConfigs in tool menu", allConfigs);
  return (
    <>
      <Grid item>
        <Tooltip title="Ouvrir contrôle de couches">
          <IconButton
            edge="start"
            color={layersControlVisible ? "third" : "primary.dark"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
            onClick={() => onVisibilityChange()}
          >
            <LayersIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Aide navigation">
          <IconButton
            onClick={showHelpTable}
            edge="start"
            color={helpTableVisible ? "third" : "primary.dark"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
          >
            <HelpIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Changement de configuration">
          <IconButton
            onClick={showConfigTable}
            edge="start"
            color={configTableVisible ? "third" : "primary.dark"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
          >
            <SettingsApplicationsIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      </Grid>
      {/*<Grid item>
        <Tooltip title="Ouvrir contrôle temporelle">
          <IconButton
            edge="start"
            color={layersControlVisible ? "third" : "primary.dark"}
            aria-label="menu"
            sx={{ ml: 2, backgroundColor: "primary.light" }}
            onClick={() => showTimeControl()}
          >
            <AccessTimeIcon fontSize={"large"} />
          </IconButton>
        </Tooltip>
      </Grid>*/}
      <Grid item id="globe64toolbar"></Grid>
      <Grid item>
        <Tooltip title="Outils">
          <IconButton
            onClick={activateToolMenu}
            color={showToolMenu ? "third" : "primary.dark"}
            aria-label="menu"
            sx={{ ml: 4, backgroundColor: "primary.light" }}
          >
            <BuildIcon style={{ color: "primary.dark" }} fontSize={"large"} />
          </IconButton>
        </Tooltip>
      </Grid>
      {showToolMenu && (
        <>
          <Grid item>
            <Tooltip title="Cliquez sur objets 3D pour infos">
              <IconButton
                edge="start"
                color={leftClickAction === "info" ? "third" : "primary.dark"}
                aria-label="menu"
                sx={{ ml: 2, backgroundColor: "primary.light" }}
                onClick={() => activateInfo()}
              >
                <AdsClickIcon fontSize={"large"} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Mesure objets 3D">
              <IconButton
                edge="start"
                color={leftClickAction === "measure" ? "third" : "primary.dark"}
                aria-label="menu"
                sx={{ ml: 2, backgroundColor: "primary.light" }}
                onClick={() => activateMeasureTool()}
              >
                <SquareFootIcon fontSize={"large"} />
              </IconButton>
            </Tooltip>
            {leftClickAction === "measure" && (
              <Grid item>
                <Tooltip title="Supprime mesurements">
                  <IconButton
                    edge="start"
                    color={
                      leftClickAction === "measure" ? "third" : "primary.dark"
                    }
                    aria-label="menu"
                    sx={{ ml: 2, backgroundColor: "primary.light" }}
                    onClick={() => eraseMeasurements()}
                  >
                    <BackspaceIcon fontSize={"large"} />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Tooltip title="Mesure XYZ sur terre">
              <IconButton
                edge="start"
                color={leftClickAction === "pick" ? "third" : "primary.dark"}
                aria-label="menu"
                sx={{ ml: 2, backgroundColor: "primary.light" }}
                onClick={() => activateGroundPicker()}
              >
                <ColorizeIcon fontSize={"large"} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Entrez en mode FPS. Clique-droite pour sortir">
              <IconButton
                edge="start"
                color={leftClickAction === "fps" ? "third" : "primary.dark"}
                sx={{ ml: 2, backgroundColor: "primary.light" }}
                onClick={() => activateFPS()}
              >
                <TravelExploreIcon fontSize={"large"} />
              </IconButton>
            </Tooltip>
          </Grid>{" "}
        </>
      )}
      {addedEntity && (
        <Grid item>
          <Tooltip title="Supprime">
            <IconButton
              edge="start"
              color={"third"}
              sx={{ ml: 2, backgroundColor: "primary.light" }}
              onClick={() => eraseAllEntites()}
            >
              <RemoveCircleIcon fontSize={"large"} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}{" "}
      {loadProgress < 100 && (
        <Grid item>
          <LoadIndicator loadProgress={loadProgress} />{" "}
        </Grid>
      )}
    </>
  );
}
