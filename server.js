'use strict';

const express = require('express');
const superagent = require('superagent');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true })); // parses form data from incoming request and put into body

app.set('view engine', 'ejs');

app.post('/searches', createSearch);


function Book(book) {
    this.title = book.title;
    this.author = book.author;
    this.cover = book.img_url || `https://i.imgur.com/J5LVHEL.jpg`;
}

function createSearch(req, res) {
    let search = req.body.search[0];
    let type = req.body.search[1];
    let url = `https://www.googleapis.com/books/v1/volumes?q=+in${type}:${search}`;

    superagent.get(url)
        .then(data => {
            console.log(data)
            res.json(data);
        })
        .catch(err => console.error(err))
}

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/hello', (req, res) => {
    res.render('pages/index');
});

app.get('/searches/new', (req, res) => {
    res.render('pages/searches/new');
});


app.listen(PORT, () => {
    console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
});
