const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const parseSlashCommand = require('../utils/slashCommandParser.js');
const User = require('../models/user.js');

// Do a peer to peer transfer
router.post('/transfer', async (req, res, next) => {

  try {
    if (req.body.token !== slackVerificationToken) {
      return res.status(403).json({});
    }

    res.send();

    // 500ms delay to ensure empty 200 response above arrives first (as required by Slack API)
    await new Promise(resolve => setTimeout(resolve, 500));

    const transferObj = parseSlashCommand(req);
    
    await User.transfer(transferObj.fromId, transferObj.toId, transferObj.amount);

    // Send success msg to slack with detials
    let responseObj = {
      response_type: 'in_channel',
      text: `<@${transferObj.fromId}> thanked <@${transferObj.toId}> ${Math.floor(transferObj.amount * 1000) / 1000} ${transferObj.amount === 1 ? 'coin' : 'coins'} ${transferObj.reason}`
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(responseObj)
    };

    fetch(req.body.response_url, requestOptions);
  }
  catch (err) {
    let responseObj = {
      response_type: 'ephemeral',
      text: '❌ Oops! Your transaction failed because something went wrong. Please try again.'
    }
  
    if (err.message === 'incorrect_slash_command_format') {
      responseObj.text = "❌ Oops! Your transaction failed because the formatting wasn't quite right. Take a look at the correctly formatted example below:";
      responseObj.attachments = [
        {
          text: '/thank @will 5 coins for writing this example!'
        }
      ]
    } else if (err.message === 'min_send_threshold') {
      responseObj.text = "❌ Oops! Your transaction failed because the amount you tried to send was too small. Try sending 1/10th of a coin or more.";
    } else if (err.message === 'send_to_self') {
      responseObj.text = "❌ Oops! Your transaction failed because you can't send to yourself!!!";
    } else if (err.message.startsWith('insufficient_funds')) {
      let wordArr = err.message.split(' ');
      responseObj.text = `❌ Oops! Your transaction failed because you tried to send ${wordArr[1]} coins, but you only have ${wordArr[2]} coins in your wallet.`;
    }

    // If anything failed then let ws server know that save failed
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(responseObj)
    };

    fetch(req.body.response_url, requestOptions);

  }

});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const lbData = await User.getLeaderboard()

    return res.json({ leaderboard: lbData });
  }
  catch (err) {
    return res.status(422).json({ err: 'failed to get leaderboard data' });
  }

});

module.exports = router;