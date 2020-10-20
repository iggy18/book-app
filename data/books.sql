DROP TABLE IF EXISTS books;

CREATE TABLE books (
  if SERIAL PRIMARY KEY,
  author VARCHAR(205),
  title VARCHAR(250),
  description TEXT,
  cover VARCHAR(250),
  isbn VARCHAR(250)
)