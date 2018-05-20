const PeopleRouter = require('express').Router();
const db = require('.././db/config');

PeopleRouter.get('/', (req, res) => {
  db.query(`
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

PeopleRouter.put('/:id', (req, res) => {
  const { name, age, quote } = req.body;
  const { id } = req.params;

  db.one(`
    UPDATE people SET
    name=$2,
    age=$3,
    quote=$4
    WHERE id=$1
    RETURNING *
  `, [id, name, age, quote]
  ).then(() => {
    res.json({success: true});
  }).catch(e => {
    console.log(e);
    res.status(500).json({error: 'Something went wrong'});
  });
});

module.exports = PeopleRouter;
