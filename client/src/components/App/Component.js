import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from '../../history';
import styles from './App.module.css';
import Home from '../Home/Component';

class App extends Component {
  render() {
    const background = require('../../assets/background.jpg');
    const backgroundStyle = {
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
    };

    return (
      <div style={backgroundStyle}>
        <Router history={history}>
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
