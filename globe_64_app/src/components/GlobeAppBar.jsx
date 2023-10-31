import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LayersIcon from '@mui/icons-material/Layers';

export default function GlobeAppBar({layersControlVisible, setLayersControlVisible}) {
    const onVisibilityChange = () => {
        setLayersControlVisible(!layersControlVisible);
    }
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor: 'grey.800'}} id='globe64toolbar'>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => onVisibilityChange()}
          >
            <LayersIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Globe-64
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}