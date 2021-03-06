import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

function Header({loggedOut}) {
  return (
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Groupie
          </Typography>
        </Toolbar>
      </AppBar>
  );
}

export default Header;