const PeopleRouter = require('express').Router();
const Person = require('../models/person');

PeopleRouter.get('/', (req, res) => {
  Person.findAll().then(people => {
    res.json(people);
  });
});

PeopleRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  Person.findById(id).then(person => {
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

  Person.update(id, { name, age, quote }).then(() => {
    res.json({success: true});
  }).catch(e => {
    console.log(e);
    res.status(500).json({error: 'Something went wrong'});
  });
});

PeopleRouter.post('/', (req, res) => {
  const { name, age, quote } = req.body;
  Person.create({name, age, quote}).then((person) => {
    res.json(person);
  }).catch(e => {
    console.log(e);
    res.status(500).json({error: 'Something went wrong'});
  });
});

module.exports = PeopleRouter;
