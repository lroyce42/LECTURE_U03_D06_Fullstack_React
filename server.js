var express = require('express');
var app = express();
const path = require('path');
const PORT = process.env.PORT || 4200;

// make everything in ./client/build public
app.use(express.static(path.resolve(__dirname, './client/build')));

// all api routes here

app.get('/api/things', (req, res) => {
  res.json(['these', 'are', 'some', 'things']);
});

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
