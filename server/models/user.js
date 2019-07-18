const mongoose = require('mongoose');

// Create user schema
const UserSchema = new mongoose.Schema({
  slackUserId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  slackUsername: {
    type: String,
  },
  slackAvatarUrl: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    type: Number,
    default: 10,
  },
},
{
  collection: 'users',
});

UserSchema.statics.dailyUpdate = async () => {
  try {
    // +1 to all wallets
    await User.updateMany({}, { $inc: { wallet: 1 } });
  } catch (err) {}
};

UserSchema.statics.hourlyUpdate = async (slackUsers) => {
  try {
    // Get user
    const dbUsers = await User.find({});

    // Update or delete users
    if (dbUsers) {
      for (let dbUser of dbUsers) {
        if (slackUsers[dbUser.slackUserId]) {
          dbUser.slackUsername = slackUsers[dbUser.slackUserId].profile.display_name;
          dbUser.slackAvatarUrl = slackUsers[dbUser.slackUserId].profile.image_192;

          await dbUser.save();

          slackUsers[dbUser.slackUserId].visited = true;
        } else {
          await User.deleteOne({ slackUserId: dbUser.slackUserId });
        }
      }
    }

    // Add new users
    Object.keys(slackUsers).forEach((key) => {
      if (!slackUsers[key].visited) {
        User.create({
          slackUserId: key,
          slackUsername: slackUsers[key].profile.display_name,
          slackAvatarUrl: slackUsers[key].profile.image_192,
        });
      }
    });
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.transfer = async (fromId, toId, amount) => {
  // These need to be up here so the catch part has access to them I believe
  const session = await User.startSession();
  session.startTransaction();

  try {
    // Only include first 3 decimal places
    amount = Math.floor(amount * 1000) / 1000;

    // User can't send less than .1 coins
    if (amount < 0.1) {
      throw new Error('min_send_threshold');
    }

    // Ensure user doesn't send to themself
    if (fromId === toId) {
      throw new Error('send_to_self');
    }

    const opts = { session, new: true };
    const A = await User.findOneAndUpdate({ slackUserId: fromId }, { $inc: { wallet: -amount } }, opts);

    // If couldnt find user A throw error so process reverts
    if (!A) {
      throw new Error();
    }

    if (A.wallet < 0) {
      // If A would have negative balance, fail and abort the transaction
      throw new Error(`insufficient_funds ${amount} ${Math.floor((A.wallet + amount) * 1000) / 1000}`);
    }

    const B = await User.findOneAndUpdate({ slackUserId: toId }, { $inc: { wallet: amount } }, opts);

    // If couldnt find user B throw error so process reverts
    if (!B) {
      throw new Error();
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();

    throw err;
  }
}

UserSchema.statics.getLeaderboard = async () => {
  try {
    const rawData = await User.find().sort({ wallet: -1 })

    const lbData = [];

    let rank = 0;
    let prevWallet = -1;

    for (let i = 0; i < rawData.length; i++) {
      const roundedWallet = (Math.floor(rawData[i].wallet * 1000) / 1000).toFixed(3);

      if (roundedWallet !== prevWallet) {
        rank = i + 1;
      }

      prevWallet = roundedWallet;

      lbData.push({
        url: rawData[i].slackAvatarUrl,
        username: rawData[i].slackUsername,
        wallet: roundedWallet,
        rank: rank,
      });
    };

    return lbData;
  } catch (err) {
    throw err;
  }
};

// Model the user schema in Mongo
const User = mongoose.model('User', UserSchema);

module.exports = User;
