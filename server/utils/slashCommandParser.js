const parseSlashCommand = (req) => {
  try {
    const transferObj = {
      fromId: req.body.user_id,
    };

    const message = req.body.text;
    let wordArr = message.toLowerCase().split(' ');
    wordArr = wordArr.filter(element => element !== '');
    const reason = wordArr.slice(3).join(' ');

    if (!wordArr[0].startsWith('<@')) {
      throw new Error();
    }

    if (wordArr[0].charAt(wordArr[0].length - 1) !== '>') {
      const splitWord = wordArr[0].split('>');
      wordArr[0] = `${splitWord[0]}>`;
      wordArr.splice(1, 0, splitWord[1]);
    }

    wordArr[1] = Number(wordArr[1]);

    if (isNaN(wordArr[1])) {
      throw new Error();
    }

    if (wordArr[2].charAt(wordArr[2].length - 1) === '!' || wordArr[2].charAt(wordArr[2].length - 1) === '.') {
      wordArr[2] = wordArr[2].slice(0, -1);
    }

    if (wordArr[2] !== 'coin' && wordArr[2] !== 'coins') {
      throw new Error();
    }

    transferObj.toId = wordArr[0].split('|')[0].substring(2).toUpperCase();
    transferObj.amount = wordArr[1];
    transferObj.reason = reason;

    return (transferObj);
  } catch (err) {
    throw new Error('incorrect_slash_command_format');
  }
};

module.exports = parseSlashCommand;
