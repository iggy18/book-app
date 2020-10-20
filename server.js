'use strict';

const express = require('express');
const superagent = require('superagent');
const dotenv = require('dotenv');
const { response } = require('express');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true })); // parses form data from incoming request and put into body

app.set('view engine', 'ejs');

app.post('/searches', createSearch);


function Book(book) {
    this.title = book.volumeInfo.title;
    this.authors = book.volumeInfo.authors;
    this.cover = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    this.description = book.volumeInfo.description;
}

function createSearch(req, res) {
    let search = req.body.search[0];
    let type = req.body.search[1];
    let url = `https://www.googleapis.com/books/v1/volumes?q=+in${type}:${search}&orderBy=relevance&maxResults=10`;

    superagent.get(url)
        .then(data => {
            let books = data.body.items.map(book => new Book(book))
            res.render('pages/searches/show', { arrayOfBooks: books });
        })
        .catch(err => {
            res.render('pages/error', { error: err});
        });
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

app.get('*', (req, res) => {
    try {
        nope();
    } catch(err) {
        res.status(404).render('pages/error', { error: err });
    }
});

app.listen(PORT, () => {
    console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
});
