//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import { memo, useCallback } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

function WmsLayerControl({setVisibilityStateWms, visibilityStateWms, addedWmsLayers}) {
  const theme = useTheme();
  console.log('visibilityStateWms', visibilityStateWms)
  console.log('addedWmsLayers', addedWmsLayers)


    const onVisibilityChange = (name, value) => {
        setVisibilityStateWms({ ...visibilityStateWms, [name]: value });
    };

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
          {Object.entries(addedWmsLayers).map((a) => {
            return (
              <ListItem  key={a[0]}  dense >
                <ListItemButton divider
                sx={{  bgcolor: visibilityStateWms[a[0]] ? theme.palette.secondary.light : theme.palette.primary.light}}
                onClick={() => onVisibilityChange(a[0], !visibilityStateWms[a[0]])}
              >
                <Checkbox
                  edge="start"
                  checked={visibilityStateWms[a[0]]}
                  tabIndex={-1}
                  disableRipple
                  sx={{padding: 0.5}}
                />
                <ListItemText  primary={a} />
              </ListItemButton>
                </ListItem >
            );
          })}
        </List>
      );
}

export default WmsLayerControl;