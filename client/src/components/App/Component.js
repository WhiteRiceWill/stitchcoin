import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../../configureStore';
import styles from './App.module.css';
import Home from '../Home/Container';
import NotFound from '../NotFound/Component';

class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;