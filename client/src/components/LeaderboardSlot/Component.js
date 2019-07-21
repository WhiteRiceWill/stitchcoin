import React, { Component } from 'react';
import styles from './LeaderboardSlot.module.css';

class LeaderboardSlot extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={styles.box}>
        <div className={styles.clientStyle}>

          <div className={styles.rank}>
            {this.props.rank}
          </div>

          <img className={styles.userImg} src={this.props.url} />

          <div className={styles.username}>
            @{this.props.username}
          </div>

          <div className={styles.wallet}>
            {this.props.wallet}
          </div>

          <img className={styles.iconImg} src={require("../../assets/stitchCoinLogo.png")} />

        </div>
      </div>
    );
  }
}

export default LeaderboardSlot;

