//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import { useState, useCallback } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";

function WmsLayerControl({setVisibilityStateWms, visibilityStateWms, addedWmsLayers, appConfig, setAppConfig, mapConfig}) {
  const theme = useTheme();
  console.log('visibilityStateWms', visibilityStateWms)
  console.log('addedWmsLayers', addedWmsLayers)
  const [url, setUrl] = useState(appConfig[mapConfig].wms.url);

    const onVisibilityChange = (name, value) => {
        setVisibilityStateWms({ ...visibilityStateWms, [name]: value });
    };

    const onWmsUrlChange = () => {
      setAppConfig(prevState => ({
        ...prevState,
        [mapConfig]: {
            ...prevState[mapConfig],
            wms: {
                ...prevState[mapConfig].wms, 
                url: url
            }
        }
    }))
  };

    return (
        <List
          sx={{ width: "100%",  bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Couches WMS
            </ListSubheader>
          }
        >
                <TextField
        id="inputChangeWms"
        label="Changer URL pour le WMS"
        value={url}
        onChange={(event) => {
          setUrl(event.target.value);
        }}
      />
              <Tooltip title="Change WMS">
        <IconButton
          size="small"
          edge="end"
          color= 'warning'
          aria-label="menu"
          sx={{ ml: 1 }}
          onClick={() => onWmsUrlChange()}
        >
          <BackspaceIcon fontSize={'large'}/>
        </IconButton>
        </Tooltip>
          {Object.entries(addedWmsLayers).map((a) => {
            return (
              <ListItem  key={a[0]}  dense >
                <ListItemButton divider
                sx={{  bgcolor: visibilityStateWms[a[0]] ?                   theme.palette.primary.light
                  : theme.palette.secondary.light,}}
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