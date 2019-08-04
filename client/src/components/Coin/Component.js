import React from 'react';
import styles from './Coin.module.css';

const Coin = () => (
  <div className={styles.coin}>
    <div className={styles.coinFront} />
    <div className={styles.coinEdge}>
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
    </div>
    <div className={styles.coinBack} />
  </div>
);

export default Coin;
