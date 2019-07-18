const User = require('../models/user.js');

const getLeaderboard = async () => {
  try {
    leaderboardData = await User.getLeaderboard();
  } catch (err) {}
};

const startLeaderboardUtil = () => {
  setInterval(() => {
    getLeaderboard();
  }, 2000);
};

module.exports = startLeaderboardUtil;
