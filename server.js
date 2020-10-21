'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // parses form data from incoming request and put into body
app.use(cors());

app.set('view engine', 'ejs');

app.post('/searches', createSearch);


function Book(book) {

    // get the image thumbnail url, and make sure its using https
    let coverURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    if(coverURL.slice(0,5) !== 'https' && coverURL.slice(0,4) === 'http') // convert to HTTP"s"
        coverURL = 'https' + coverURL.slice(4);

    // collect the isbn 13 vale, we'll ignore isbn 10 for now
    let isbn = book.volumeInfo.industryIdentifiers.reduce( (acc, identifier) => {
        if(identifier.type === 'ISBN_13')
            return identifier.identifier;
        return acc;
    }, 0);

    // assign values
    this.title = book.volumeInfo.title;
    // we're using the first author only, when listed
    this.authors = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unkown';
    this.description = book.volumeInfo.description;
    this.cover = coverURL;
    this.isbn = isbn;
}

function createSearch(req, res) {
    let search = req.body.search[0];
    let type = req.body.search[1];
    let url = `https://www.googleapis.com/books/v1/volumes?q=+in${type}:${search}&orderBy=relevance&maxResults=10`;

    superagent.get(url)
        .then(data => {
            console.log(data.body.items);
            let books = data.body.items.map(book => new Book(book))
            res.render('pages/searches/show', { arrayOfBooks: books });
        })
        .catch(err => {
            res.render('pages/error', { error: err});
        });
}

app.get('/', (req, res) => {
    let SQL = 'SELECT * FROM books;';

    return client.query(SQL)
        .then(result => {
            console.log(result.rows);
            res.render('pages/index', { books : result.rows });
        })
        .catch(err => console.error(err));

});

app.get('/searches/new', (req, res) => {
    res.render('pages/searches/new');
});

app.get('*', (req, res) => {
    try {
        throw 'Page does not exist!';
    } catch(err) {
        console.error(err);
        res.status(404).render('pages/error', { error: err });
    }
});

client.connect( () => {
    app.listen(PORT, () => {
        console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
    });
});
