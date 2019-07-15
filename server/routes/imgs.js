// User route

const express = require('express');
const router = express.Router();


router.get('/:imgid', async (req, res, next) => {



try {

  // Send image for social cards
 res.sendFile('/assets/imgs/' + req.params.imgid, {'root': './'});

}

 catch (err) {
   return res.status(422).json({err: 'Could not get img'});
 }

});




module.exports = router;
