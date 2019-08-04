import React from 'react';
import styles from './LeaderboardSlot.module.css';

const LeaderboardSlot = ({ rank, url, username, wallet }) => (
  <div className={styles.box}>
    <div className={styles.clientStyle}>
      <div className={styles.rank}>
        {rank}
      </div>
      <img className={styles.userImg} src={url} />
      <div className={styles.username}>
        @{username}
      </div>
      <div className={styles.wallet}>
        {wallet}
      </div>
      <img className={styles.iconImg} src={require('../../assets/stitchCoinLogo.png')} />
    </div>
  </div>
);

export default LeaderboardSlot;
