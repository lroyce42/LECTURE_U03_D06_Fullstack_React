const db = require('.././db/config');

const Person = {
  update: (id, attrs) => {
    const {name, age, quote} = attrs;
    return db.one(`
      UPDATE people SET
      name=$2,
      age=$3,
      quote=$4
      WHERE id=$1
      RETURNING *
    `, [id, name, age, quote]
    );
  },

  findAll: () => {
    return db.query(
      `SELECT * FROM people`
    );
  },

  findById: id => {
    return db.oneOrNone(
      `SELECT * FROM people WHERE id = $1`, id
    );
  },

  create: attrs => {
    const { name, age, quote } = attrs;
    return db.one(`
      INSERT into people
      (name, age, quote)
      VALUES($1, $2, $3)
      RETURNING *
    `, [name, age, quote]);
  }
};

module.exports = Person
