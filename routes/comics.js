const express = require("express");
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");
require("dotenv").config();
const apikey = process.env.MARVEL_PUBLIC_KEY;
const api_secret = process.env.MARVEL_PRIVATE_KEY;

const router = express.Router();

// fetch all comics of a certain request
router.post("/comics", async (req, res) => {
  const body = req.fields;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);

    let response;
    // if (Object.keys(body) !== 0) {
    try {
      if (body.search) {
        response = await axios({
          url: `http://gateway.marvel.com/v1/public/comics?orderBy=title${
            body.limit ? "&limit=" + body.limit : ""
          }${
            body.page && body.page !== 1
              ? "&offset=" + (body.page - 1) * body.limit
              : ""
          }&titleStartsWith=${body.search}`,
          method: "get",
          params: {
            apikey,
            ts: timestamp,
            hash,
          },
        });
      } else {
        response = await axios({
          url: `http://gateway.marvel.com/v1/public/comics?orderBy=title${
            body.limit ? "&limit=" + body.limit : ""
          }${
            body.page && body.page !== 1
              ? "&offset=" + (body.page - 1) * body.limit
              : ""
          }`,
          method: "get",
          params: {
            apikey,
            ts: timestamp,
            hash: hash,
          },
        });
      }
    } catch (error) {
      // console.log(error.response);
      res.status(400).json(error.response);
    }
    // }
    const responseObject = {
      results: response.data.data.results,
      total: response.data.data.total,
    };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(400).json(error.response);
  }
});

// fetch all comics related to a certain character
router.get("/character/:id/comics", async (req, res) => {
  const id = req.params.id;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);

    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/characters/" + id + "/comics",
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

router.get("/comic/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);

    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/comics/" + id,
      method: "get",
      params: {
        apikey,
        ts: timestamp,
        hash,
      },
    });
    res.status(200).json(response.data.data.results);
  } catch (error) {
    res.status(400).json(error.response);
  }
});

module.exports = router;
