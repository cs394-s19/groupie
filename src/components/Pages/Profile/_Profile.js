import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CalendarList from './_ProfilePageTest'
import firebase from 'firebase/app';
import 'firebase/auth';
import Login from '../Login/Login';
import AuthContext from '../../util/AuthContext';

import App from './App';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function logout() {
  firebase.auth().signOut();
}

function InviteScreen({classes}) {
  return (
    <AuthContext.Consumer>
      {user => user == null ? <Login /> :
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Import Calendars
          </Typography>

          <App />
          <CalendarList/>


        </CardContent>
        <CardActions>
          <Button size="small">
            Submit
          </Button>
        </CardActions>
        <Button onClick={logout} type="primary">Log out</Button>
      </Card>}
    </AuthContext.Consumer>
  );
}

InviteScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InviteScreen);


