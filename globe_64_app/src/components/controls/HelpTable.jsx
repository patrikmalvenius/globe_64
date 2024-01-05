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
            borderColor: "secondary.light",
            borderRadius: 1,
            mt: 2,
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
              <Tab icon={<CancelIcon />} iconPosition="start" label="Ferme" />
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
                <ListItemText
                  primary="Panorer"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Clique gauche + tire
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem key="sourismiddle">
                <MouseRightIcon />
                <ListItemText
                  primary="Zoom"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Clique droit + tire, ou défile mollette
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem key="sourisright">
                <MouseMiddleIcon />

                <ListItemText
                  primary="Rotation"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Clique mollette + tire, ou CTRL + clique Gauche/Droit +
                      tire
                    </Typography>
                  }
                />
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
                <ListItemText
                  primary="Panorer"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Tire avec un doigt
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem key="touchzoom">
                <TouchZoomIcon />
                <ListItemText
                  primary="Zoom"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Pince avec deux doigts
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem key="touchtilt">
                <TouchTiltIcon />
                <ListItemText
                  primary="Tilt"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Tire avec deux doigts, même direction
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem key="touchrotate">
                <TouchRotateIcon />
                <ListItemText
                  primary="Rotation"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Tire avec deux doigts, direction opposée
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </LayerControlTabPanel>
        </Box>
      </ClickAwayListener>
    )
  );
}
export default HelpTable;
