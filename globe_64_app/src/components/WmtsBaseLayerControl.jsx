//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import { memo, useCallback } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";

function WmtsBaseLayerControl({
  setVisibilityStateWmtsBaselayer,
  visibilityStateWmtsBaselayer,
  wmtsBaseLayers,
}) {
  const theme = useTheme();
  console.log("visibilityStateWmtsBaselayer", visibilityStateWmtsBaselayer);
  console.log("addedWmtsBaselayer", wmtsBaseLayers);

  const onVisibilityChange = (name, value) => {
    const newVisibilityState = {};
    Object.keys(visibilityStateWmtsBaselayer).forEach((k) => {
      newVisibilityState[k] = !visibilityStateWmtsBaselayer[k];
    });
    console.log("newVisibilityState", newVisibilityState);
    console.log("visibilityStateWmtsBaselayer", visibilityStateWmtsBaselayer);
    setVisibilityStateWmtsBaselayer({
      ...newVisibilityState,
    });
  };

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Layers
        </ListSubheader>
      }
    >
      {Object.entries(wmtsBaseLayers).map((a) => {
        return (
          <ListItem key={a[0]}>
            <ListItemButton
              sx={{
                bgcolor: visibilityStateWmtsBaselayer[a[0]]
                  ? theme.palette.secondary.light
                  : theme.palette.primary.light,
              }}
              onClick={() =>
                onVisibilityChange(a[0], !visibilityStateWmtsBaselayer[a[0]])
              }
            >
              <ListItemText primary={a[1]["nom"]} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default WmtsBaseLayerControl;
