'use strict';

const express = require('express');
const dotenv = require('dotenv');
const app = express();
const superagent = require('superagent');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.set('view engine', 'ejs');

function createSearch(req, res) {
  let url = `https`;
}

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/hello', (req, res) => {
  res.render('pages/index');
});

app.get('/search/new', (req, res) => {
  res.render('pages/searches/new');
});

app.listen(PORT, () => {
  console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
});
