'use strict';

const express = require('express');
const superagent = require('superagent');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.set('view engine', 'ejs');

function Book (book){
    this.title = book.title;
    this.author = book.author;
    this.cover = book.img_url || `https://i.imgur.com/J5LVHEL.jpg`;
}

function createSEarch(req, res) {
    let url = `https`
}

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/hello', (req, res) => {
    res.render('pages/index');
});

app.listen(PORT, () => {
    console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
});