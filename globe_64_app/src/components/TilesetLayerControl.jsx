//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import { memo, useCallback } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from '@mui/material/ListItemIcon';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useTheme } from '@mui/material/styles';

function TilesetLayerControl({setVisibilityStateTile, visibilityStateTile, tileLayers, viewer, addedTilesets}) {
  const theme = useTheme();
  console.log('visibilityStateTile', visibilityStateTile)
  Object.entries(tileLayers).map((a) => {console.log(a)})


    const onVisibilityChange = (name, value) => {
        setVisibilityStateTile({ ...visibilityStateTile, [name]: value });
    };

    const onClick2 = (tileset)=>{
      if (viewer.current && viewer.current.cesiumElement) {
        viewer.current.cesiumElement.flyTo(addedTilesets[tileset])
      } else {
        console.log('Viewer not available')
      }

    }
    return (
        <List
          sx={{ width: "100%",  bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Layers
            </ListSubheader>
          }
        >
          {Object.entries(tileLayers).map((a) => {
            return (
              <ListItem  key={a[1]['title']} >
                <ListItemButton
                sx={{ bgcolor: visibilityStateTile[a[0]] ? theme.palette.secondary.light : theme.palette.primary.light}}
                onClick={() => onVisibilityChange(a[0], !visibilityStateTile[a[0]])}
              >
                <ListItemText primary={a[1]['title']} />
              </ListItemButton>

              <ListItemIcon>
                <FlightTakeoffIcon onClick={() => onClick2(a[0])}/>
              </ListItemIcon>

  </ListItem >
            );
          })}
        </List>
      );
}

export default TilesetLayerControl;