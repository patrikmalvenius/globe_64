import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LayerControlTabPanel from "./LayerControlTabPanel";
import WmsLayerControl from "./WmsLayerControl";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import MouseIcon from "../icons/Mouse";
import TouchIcon from "../icons/Touch";
import MouseLeftIcon from "../icons/MouseLeft";
import MouseMiddleIcon from "../icons/MouseMiddle";
import MouseRightIcon from "../icons/MouseRight";
import TouchDragIcon from "../icons/TouchDrag";
import TouchRotateIcon from "../icons/TouchRotate";
import TouchTiltIcon from "../icons/TouchTilt";
import TouchZoomIcon from "../icons/TouchZoom";
import CancelIcon from "@mui/icons-material/Cancel";
import { Cancel } from "@mui/icons-material";

function HelpTable({ helpTableVisible, setHelpTableVisible }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    newValue === 2 ? handleClickAway() : setValue(newValue);
  };
  const handleClickAway = () => {
    setHelpTableVisible(false);
  };
  return (
    helpTableVisible && (
      <ClickAwayListener onClickAway={handleClickAway}>
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
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="helptable tabs"
            >
              <Tab icon={<MouseIcon />} iconPosition="start" label="Souris" />
              <Tab icon={<TouchIcon />} iconPosition="start" label="Touche" />
              <Tab icon={<CancelIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          <LayerControlTabPanel value={value} index={0}>
            <List
              sx={{
                width: "100%",
                bgcolor: "primary.light",

                maxHeight: 800,
                overflowY: "auto",
                overflowX: "hidden",
              }}
              component="nav"
            >
              <ListItem key="sourisleft">
                <MouseLeftIcon />
                <ListItemText primary="souris" />
              </ListItem>
              <ListItem key="sourismiddle">
                <MouseMiddleIcon />
                <ListItemText primary="souris" />
              </ListItem>
              <ListItem key="sourisright">
                <MouseRightIcon />

                <ListItemText primary="souris" />
              </ListItem>
            </List>
          </LayerControlTabPanel>

          <LayerControlTabPanel value={value} index={1}>
            <List
              sx={{
                width: "100%",
                bgcolor: "primary.light",

                maxHeight: 800,
                overflowY: "auto",
                overflowX: "hidden",
              }}
              component="nav"
            >
              <ListItem key="touchdrag">
                <TouchDragIcon />
                <ListItemText primary="touch" />
              </ListItem>
              <ListItem key="touchrotate">
                <TouchRotateIcon />
                <ListItemText primary="touchrotate" />
              </ListItem>
              <ListItem key="touchtilt">
                <TouchTiltIcon />
                <ListItemText primary="touchtilt" />
              </ListItem>
              <ListItem key="touchzoom">
                <TouchZoomIcon />
                <ListItemText primary="touchzoom" />
              </ListItem>
            </List>
          </LayerControlTabPanel>
        </Box>
      </ClickAwayListener>
    )
  );
}
export default HelpTable;