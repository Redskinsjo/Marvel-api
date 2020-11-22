const express = require('express');
const User = require('../models/User');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');

const router = express.Router();

router.post('/signin', async (req, res) => {
  const body = req.fields;
  try {
    if (!body.email) {
      res.status(400).json({ error: 'Missing an email' });
    } else if (!body.password) {
      res.status(400).json({ error: 'Missing a password' });
    } else {
      const { email, password } = body;
      const isExist = await User.findOne({ email }).select('-hash -salt');
      if (!isExist) {
        res.status(400).json({ error: 'Any account existing with this email' });
      } else {
        const potential = sha256(password + isExist.salt).toString(base64);
        const isSignedIn = false;
        if (potential === isExist.hash) isSignedIn = true;
        if (!isSignedIn) {
          res.status(400).json({ error: 'Unauthorized. Wrong password' });
        } else {
          res.status(200).json(isExist);
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

module.exports = router;
