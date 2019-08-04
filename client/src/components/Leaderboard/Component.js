import React, { Component } from 'react';
import styles from './Leaderboard.module.css';
import LeaderboardSlot from '../LeaderboardSlot/Component';
import Coin from '../Coin/Component';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: null,
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
        leaderboard: data.leaderboard,
      });
    } catch (err) {};
  }

  render() {
    let leaderboardItems = null;
    const { leaderboard } = this.state;

    if (leaderboard) {
      leaderboardItems = leaderboard.map(user => (
        <LeaderboardSlot
          key={user.id}
          username={user.username}
          wallet={user.wallet}
          rank={user.rank}
          url={user.url}
        />
      ));
    }

    return (
      <div className={styles.page}>
        <div className={styles.middlePage}>
          <Coin />
          {leaderboardItems}
          <div className={styles.footer} />
        </div>
      </div>
    );
  }
}

export default Leaderboard;
