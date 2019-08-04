const fetch = require('node-fetch');
const Agenda = require('agenda');
const User = require('../models/user.js');

const parseResponse = (data) => {
  const usersArr = data.members;
  const usersObj = {};

  for (let user of usersArr) {
    if (!user.is_bot && !user.deleted && user.id !== 'USLACKBOT') {
      usersObj[user.id] = user;
    }
  }

  return usersObj;
};

const syncWithSlack = async () => {
  try {
    const response = await fetch(`https://slack.com/api/users.list?token=${slackAccessToken}`);
    const data = await response.json();
    const slackUsers = parseResponse(data);

    User.hourlyUpdate(slackUsers);
  } catch (err) {};
};

const getLeaderboard = async () => {
  try {
    leaderboardData = await User.getLeaderboard();
  } catch (err) {};
};

const startSchedule = () => {
  // Initial sync
  syncWithSlack();
  getLeaderboard();

  const agenda = new Agenda({ db: { address: global.dbUri } });

  agenda.processEvery('1 second');

  agenda.define('get leaderboard', () => {
    getLeaderboard();
  });

  agenda.define('sync with slack', () => {
    syncWithSlack();
    console.log('Hourly sync with slack happened');
  });

  agenda.define('daily update', () => {
    User.dailyUpdate();
    console.log('Daily update happened');
  });

  (async () => {
    await agenda.start();
    await agenda.cancel();
    await agenda.every('2 seconds', 'get leaderboard');
    await agenda.every('59 * * * *', 'sync with slack');
    await agenda.every('0 7 * * *', 'daily update');
  })();
};

module.exports = startSchedule;
