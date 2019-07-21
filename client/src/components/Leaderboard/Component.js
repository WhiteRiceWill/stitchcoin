import React, { Component } from 'react';
import styles from './Leaderboard.module.css';
import LeaderboardSlot from '../LeaderboardSlot/Component.js';

class Leaderboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      leaderboard: null
    };

    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  componentDidMount() {
    this.getLeaderboard();
    this.leaderboardInterval = setInterval(() => {
      this.getLeaderboard();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.leaderboardInterval);
  }

  async getLeaderboard() {
    try {
      const response = await fetch('/api/user/leaderboard');
      const data = await response.json();

      this.setState({
        leaderboard: data.leaderboard
      });
    } catch (err) {}
  }

  render() {
    let leaderboard = null;

    if (this.state.leaderboard !== null) {
      leaderboard = this.state.leaderboard.map(user =>
        <LeaderboardSlot
          key={user.id}
          id={user.id}
          username={user.username}
          wallet={user.wallet}
          rank={user.rank}
          url={user.url}
        />
      )
    }

    return (
      <div className={styles.page}>
        <div className={styles.middlePage}>

        <div className={styles.coin}>
          <div className={styles.coin__front}></div>
          <div className={styles.coin__edge}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>

          </div>
          <div className={styles.coin__back}></div>
        </div>

        {leaderboard}

        </div>
      </div>
    );
  }
}

export default Leaderboard;

