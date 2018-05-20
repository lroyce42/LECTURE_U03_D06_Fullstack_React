DROP DATABASE IF EXISTS my_first_fullstack_react;
CREATE DATABASE my_first_fullstack_react;

\c my_first_fullstack_react

CREATE TABLE people(
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  age integer NOT NULL,
  quote varchar(255) NOT NULL
);

INSERT INTO people(name, age, quote)
VALUES
  ('Joey Tribbiani', 34, 'How you doin?'),
  ('Ross Geller', 37, 'We were on a break!'),
  ('Phoebe Buffay', 36, 'Smelly cat, smelly cat...'),
  ('Chandler Bing', 35, 'bing!'),
  ('Monica Geller', 33, 'LOL jkjk sry ttyl'),
  ('Rachel Green', 32, 'I think React is so great. Ari is such a good teacher!')
;


SELECT * FROM people;
