//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TelegramIcon from "@mui/icons-material/Telegram";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { useTheme } from "@mui/material/styles";

function TilesetLayerControl({
  setVisibilityStateTile,
  visibilityStateTile,
  tileLayers,
  viewer,
  addedTilesets,
}) {
  const theme = useTheme();

  const onVisibilityChange = (name, value) => {
    setVisibilityStateTile({ ...visibilityStateTile, [name]: value });
  };

  const onClick2 = (tileset) => {
    if (viewer.current && viewer.current.cesiumElement) {
      viewer.current.cesiumElement.flyTo(addedTilesets[tileset]);
    } else {
      console.log("Viewer not available");
    }
  };
  return (
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
          Couches des modèles
        </ListSubheader>
      }
    >
      {Object.entries(tileLayers).map((a) => {
        return (
          <ListItem key={a[1]["title"]} dense>
            <ListItemButton
              divider
              sx={{
                bgcolor: visibilityStateTile[a[0]]
                  ? "background.paper"
                  : theme.palette.primary.off,
              }}
              onClick={() =>
                onVisibilityChange(a[0], !visibilityStateTile[a[0]])
              }
            >
              <Checkbox
                edge="start"
                checked={visibilityStateTile[a[0]]}
                tabIndex={-1}
                disableRipple
                color="secondary"
                sx={{ padding: 0.5 }}
              />
              <ListItemText primary={a[1]["title"]} />
            </ListItemButton>
            <Tooltip title="Zoom sur couche">
              <IconButton
                size="small"
                edge="end"
                aria-label="menu"
                onClick={() => onClick2(a[0])}
                sx={{ padding: 0.5 }}
                color="third"
              >
                {" "}
                <TelegramIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}

export default TilesetLayerControl;
