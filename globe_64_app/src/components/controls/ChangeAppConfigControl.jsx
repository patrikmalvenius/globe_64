//expanded from https://stackoverflow.com/questions/75688118/how-to-toggle-layers-in-mapbox-gl-js-using-react
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

function ChangeAppConfigControl({
  configTableVisible,
  setConfigTableVisible,
  allConfigs,
  setMapConfig,
  mapConfig,
}) {
  const theme = useTheme();

  const onConfigChange = (name) => {
    setMapConfig(name);
    handleClickAway();
  };

  const handleClickAway = () => {
    setConfigTableVisible(!configTableVisible);
  };
  console.log("mapConfig", mapConfig);
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <List
        sx={{
          width: "20%",
          height: "100%",
          minWidth: "350px",
          position: "relative",
          bgcolor: "primary.light",
          borderRadius: 4,
          mt: 2,
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
            Changement de configuration des cartes
          </ListSubheader>
        }
      >
        {allConfigs.map((a) => {
          //const id = a;
          const name = a;
          console.log("name", name);
          return (
            <ListItem key={name} dense>
              <ListItemButton
                divider
                sx={
                  {
                    // bgcolor: visibilityStateWmtsBaselayer[id]
                    //</ListItem>   ? "background.paper"
                    //   : theme.palette.primary.off,
                  }
                }
                onClick={() => onConfigChange(name)}
              >
                <Checkbox
                  edge="start"
                  checked={mapConfig == name ? true : false}
                  tabIndex={-1}
                  disableRipple
                  color="secondary"
                  sx={{ padding: 0.5 }}
                />
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </ClickAwayListener>
  );
}

export default ChangeAppConfigControl;
