const express = require('express');
const axios = require('axios');
const uid2 = require('uid2');
const md5 = require('md5');
require('dotenv').config();
const apikey = process.env.MARVEL_PUBLIC_KEY;
const api_secret = process.env.MARVEL_PRIVATE_KEY;

const router = express.Router();

router.post('/characters', async (req, res) => {
  const body = req.fields;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);
    let response;
    let sent;
    if (Object.keys(body).length !== 0) {
      try {
        if (body.search) {
          response = await axios({
            url: `http://gateway.marvel.com/v1/public/characters?orderBy=name&limit=${
              body.limit ? body.limit : null
            }&offset=${
              body.page !== 1 ? (body.page - 1) * body.limit : 0
            }&nameStartsWith=${body.search}`,
            method: 'get',
            params: {
              apikey,
              ts: timestamp,
              hash,
            },
          });
          sent = await axios({
            url: `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${body.search}`,
            method: 'get',
            params: {
              apikey,
              ts: timestamp,
              hash,
            },
          });
        } else {
          response = await axios({
            url: `http://gateway.marvel.com/v1/public/characters?orderBy=name&limit=${
              body.limit ? body.limit : null
            }&offset=${body.page !== 1 ? (body.page - 1) * body.limit : 0}`,
            method: 'get',
            params: {
              apikey,
              ts: timestamp,
              hash,
            },
          });
          sent = await axios({
            url: `http://gateway.marvel.com/v1/public/characters`,
            method: 'get',
            params: {
              apikey,
              ts: timestamp,
              hash,
            },
          });
        }
      } catch (error) {
        res.status(400).json(error.response);
      }
    }
    res.status(200).json({
      results: response.data.data.results,
      total: sent.data.data.total,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json(error.response);
  }
});

router.get('/character/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const timestamp = uid2(7);
    const hash = md5(timestamp + api_secret + apikey);

    const response = await axios({
      url: 'http://gateway.marvel.com/v1/public/characters/' + id,
      method: 'get',
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
