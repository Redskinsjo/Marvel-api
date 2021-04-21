const express = require("express");
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");
require("dotenv").config();
const apikey = process.env.MARVEL_PUBLIC_KEY;
const api_secret = process.env.MARVEL_PRIVATE_KEY;

const router = express.Router();

// fetch all events related to a certain character
router.get("/character/:id/events", async (req, res) => {
  const id = req.params.id;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);

    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/characters/" + id + "/events",
      method: "get",
      params: {
        apikey,
        ts: timestamp,
        hash,
      },
    });
    console.log(response.data.data.results);
    res.status(200).json(response.data.data.results);
  } catch (error) {
    res.status(400).json(error.response);
  }
});

module.exports = router;
