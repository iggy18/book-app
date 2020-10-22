DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  authors VARCHAR(205),
  title VARCHAR(250),
  description TEXT,
  cover TEXT,
  isbn VARCHAR(13)
);

INSERT INTO books (authors, title, description, cover, isbn)
  VALUES ('author', 'title', 'description', 'https://i.imgur.com/J5LVHEL.jpg', '1234567890123');

INSERT INTO books (authors, title, description, cover, isbn)
  VALUES ('author2', 'title2', 'description2', 'https://i.imgur.com/J5LVHEL.jpg', '5555555555555');