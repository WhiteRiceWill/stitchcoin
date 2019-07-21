import React, { Component } from 'react';
import styles from './Home.module.css';
import Leaderboard from '../Leaderboard/Component.js';

class Home extends Component {
  render() {
    return (
      <div>
        <Leaderboard />
      </div>
    );
  }
}

export default Home;
