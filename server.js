'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');
const { response } = require('express');
const app = express();

let flag = false;

const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // parses form data from incoming request and put into body
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(cors());


app.get('/', getLibrary);
app.get('/searches/new', newSearch);
app.post('/searches', createSearch);
app.get('/books/:id', getBookDetails);
app.put('/books/:id', updateBookDetails);
app.delete('/books/:id/delete', deleteBookDetails);
app.post('/books', saveBook);

function getLibrary(req, res) {
    let SQL = 'SELECT * FROM books;';

    return client.query(SQL)
        .then(result => {
            // console.log(result.rows);
            console.log(result.rows);
            res.render('pages/index', { books: result.rows, flag: true });
        })
        .catch(err => handleError(err, res));
}

function newSearch(req, res) {
    res.render('pages/searches/new');
}

function createSearch(req, res) {
    let search = req.body.search[0];
    let type = req.body.search[1];
    let url = `https://www.googleapis.com/books/v1/volumes?q=+in${type}:${search}&orderBy=relevance&maxResults=10`;

    superagent.get(url)
        .then(data => {
            console.log('SUPERAGENT', data.body.items);
            if (!data.body.items) {
                res.render('pages/searches/noResults')
            }
            let books = data.body.items.map(book => new Book(book))
            console.log('BOOKS', books);
            res.render('pages/searches/show', { arrayOfBooks: books, flag: false });
        })
        .catch(err => handleError(err, res));
}

function getBookDetails(req, res) {
    let SQL = 'SELECT * FROM books WHERE id=$1;';
    let values = [req.params.id];
    return client.query(SQL, values)
        .then(results => {
            res.render('pages/books/show', { book: results.rows[0], flag: flag });
        })
        .catch(err => handleError(err, res));
}

function updateBookDetails(req, res) {

    console.log('UPDATE BUTTON PUSHED');

    let { authors, title, descriptions, cover, isbn } = req.body;

    let SQL = 'UPDATE books SET authors=$1, title=$2, description=$3, cover=$4, isbn=$5 WHERE id=$6;';
    let values = [authors, title, descriptions, cover, isbn, req.params.id];

    client.query(SQL, values)
        .then(res.redirect(`/books/${req.params.id}`))
        .catch(err => handleError(err));
}

function deleteBookDetails(req, res) {

    console.log('DELETE BUTTON PUSHED');

    let SQL = 'DELETE FROM books WHERE id=$1;';
    let values = [req.params.id];

    client.query(SQL, values)
        .then(res.redirect(`/`))
        .catch(err => handleError(err));
}

function saveBook(req, res) {
    let { authors, title, description, cover, isbn } = req.body;
    console.log('REQ BODY', req.body);

    let SQL = 'SELECT * FROM books WHERE isbn=$1;';
    let values = [isbn];

    return client.query(SQL, values)
        .then(results => {
            let alreadySaved = results.rows.length;

            if (alreadySaved) {
                console.log('already saved');
                flag = true;
                res.redirect(`/books/${results.rows[0].id}`);
            } else {
                SQL = 'INSERT INTO books(authors, title, description, cover, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING id;';
                values = [authors, title, description, cover, isbn];
                console.log('save values', values);
                console.log('saving now');
                flag = true;

                return client.query(SQL, values)
                    // .then(console.log(results.rows[0].id))
                    .then(results => res.redirect(`/books/${results.rows[0].id}`))
                    .catch(err => handleError(err, res));
            }

        })
        .catch(err => handleError(err, res));
}

function handleError(err, res) {
    console.log('ERROR', err);
    res.render('pages/error', { error: err });
}

app.get('*', (req, res) => {
    try {
        throw 'Page does not exist!';
    } catch (err) {
        handleError(err, res);
    }
});

client.connect(() => {
    app.listen(PORT, () => {
        console.log(`ಠ_ಠ it's noisy on port ${PORT}`);
    });
});

function Book(book) {
    // get the image thumbnail url, and make sure its using https
    let coverURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    if (coverURL.slice(0, 5) !== 'https' && coverURL.slice(0, 4) === 'http') // convert to HTTP"s"
        coverURL = 'https' + coverURL.slice(4);

    // collect the isbn 13 vale, we'll ignore isbn 10 for now
    let isbn = book.volumeInfo.industryIdentifiers.reduce((acc, identifier) => {
        if (identifier.type === 'ISBN_13')
            return identifier.identifier;
        return acc;
    }, 0);

    let authors = book.volumeInfo.authors;
    if (!authors)
        authors = 'unknown';
    else if (authors.length > 1)
        authors = authors.join(', ');
    else
        authors = authors[0];


    // assign values
    this.title = book.volumeInfo.title;
    this.authors = authors;
    this.description = book.volumeInfo.description;
    this.cover = coverURL;
    this.isbn = isbn;
}
