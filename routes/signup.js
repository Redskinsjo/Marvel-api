const express = require('express');
const User = require('../models/User');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const uid2 = require('uid2');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const body = req.fields;

  try {
    if (!body.email) {
      res.status(400).json({ error: 'Missing an email' });
    } else if (!body.fullname) {
      res.status(400).json({ error: 'Missing a name' });
    } else if (!body.password) {
      res.status(400).json({ error: 'Missing a password' });
    } else {
      const { email, fullname, password } = body;
      const isExist = await User.findOne({ email });
      if (isExist) {
        res.status(400).json({ error: 'User already exists with this email' });
      } else {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = sha256(password + salt).toString(base64);
        const newUser = {
          email,
          account: {
            fullname,
            phone: body.phone || null,
          },
          token,
          hash,
          salt,
        };

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          token,
          email,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json(error.response);
  }
});

module.exports = router;
