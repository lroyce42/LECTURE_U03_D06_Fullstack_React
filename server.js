var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4200;
const PeopleRouter = require('./routers/people.js');

// make everything in ./client/build public
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// all api routes here

app.use('/api/people', PeopleRouter);

app.get('*', (req, res) => {
  console.log(req.headers)
  if (isXhr(req)) { // if ajax request
    // no route found
    res.status(404).json({error: 'not found'});
  } else { // else, browser request
    // let react handle routing client side
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// https://stackoverflow.com/a/28540611
const isXhr = req => req.xhr || req.headers.accept.indexOf('json') > -1;
