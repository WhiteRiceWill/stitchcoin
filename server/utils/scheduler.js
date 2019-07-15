const fetch = require('node-fetch');
const User = require('../models/user.js');
const schedule = require('node-schedule');

const startSchedule = () => {
  // Hourly Update at minute 59
  schedule.scheduleJob('59 * * * *', () => {
    syncWithSlack();
  });

  // Daily update at midnight
  schedule.scheduleJob('0 7 * * *', () => {
    User.dailyUpdate();
  });
}

const syncWithSlack = async () => {
  try {
    const response = await fetch(`https://slack.com/api/users.list?token=${slackAccessToken}`);
    const json = await response.json();
    const slackUsers = parseResponse(json);

    User.hourlyUpdate(slackUsers);
  }

  catch (err) {
  }
}

const parseResponse = json => {
  const usersArr = json.members;
  let usersObj = {};

  for (let user of usersArr) {
    if (!user.is_bot && !user.deleted && user.id !== 'USLACKBOT') {
      usersObj[user.id] = user;
    }
  }

  return usersObj;
}

module.exports = startSchedule;