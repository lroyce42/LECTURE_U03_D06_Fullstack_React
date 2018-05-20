const people = require('../data/people.js');
const PeopleRouter = require('express').Router();

PeopleRouter.get('/', (req, res) => {
  res.json(people);
});

PeopleRouter.get('/:id', (req, res) => {
  const person = people.find(p => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({error: 'Not Found'});
  }
});

module.exports = PeopleRouter;
