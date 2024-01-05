import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ColorizeIcon from "@mui/icons-material/Colorize";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BuildIcon from "@mui/icons-material/Build";
export default function ToolMenu({
  setLeftClickAction,
  leftClickAction,
  handleClick,
  setHelpTableVisible,
  helpTableVisible,
}) {
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
  return (
    <ClickAwayListener onClickAway={handleClick}>
      <Box
        sx={{
          width: "20%",
          minWidth: "400px",
          position: "absolute",
          border: 2,
          bgcolor: "primary.light",
          borderColor: "secondary.light",
          borderRadius: 1,
          mt: 2,
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
                color={leftClickAction === "measure" ? "third" : "primary.dark"}
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
                color={leftClickAction === "pick" ? "third" : "primary.dark"}
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
                color={leftClickAction === "walk" ? "third" : "primary.dark"}
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
                color={leftClickAction === "info" ? "third" : "primary.dark"}
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
  );
}
