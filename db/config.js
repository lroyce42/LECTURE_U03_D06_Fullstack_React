const options = {
  query: (e) => {
    console.log(e.query);
  }
};

const pgp = require('pg-promise')(options);
const dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/my_first_fullstack_react';
const db = pgp(dbUrl);

module.exports = db;
