//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";

function WmtsBaseLayerControl({
  setVisibilityStateWmtsBaselayer,
  visibilityStateWmtsBaselayer,
  wmtsBaseLayers,
}) {
  const theme = useTheme();

  const onVisibilityChange = (name, value) => {
    const newVisibilityState = {};
    Object.keys(visibilityStateWmtsBaselayer).forEach((k) => {
      newVisibilityState[k] = !visibilityStateWmtsBaselayer[k];
    });

    setVisibilityStateWmtsBaselayer({
      ...newVisibilityState,
    });
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
          Couches de fonds de plan
        </ListSubheader>
      }
    >
      {Object.entries(wmtsBaseLayers).map((a) => {
        const id = a[0];
        const title = a[1]["nom"];
        return (
          <ListItem key={id} dense>
            <ListItemButton
              divider
              sx={{
                bgcolor: visibilityStateWmtsBaselayer[id]
                  ? "background.paper"
                  : theme.palette.primary.off,
              }}
              onClick={() =>
                onVisibilityChange(a[0], !visibilityStateWmtsBaselayer[id])
              }
            >
              <Checkbox
                edge="start"
                checked={visibilityStateWmtsBaselayer[id]}
                tabIndex={-1}
                disableRipple
                color="secondary"
                sx={{ padding: 0.5 }}
              />
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default WmtsBaseLayerControl;
