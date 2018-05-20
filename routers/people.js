const PeopleRouter = require('express').Router();
const db = require('.././db/config');

PeopleRouter.get('/', (req, res) => {
  return db.query(`
    SELECT *
    FROM people
  `).then(people => {
    res.json(people)
  });
});

PeopleRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  db.oneOrNone(
    `SELECT * FROM people WHERE id = $1`, id
  ).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({error: 'Not Found'});
    }
  });
});

module.exports = PeopleRouter;
