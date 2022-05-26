const express = require('express');
const routes = require('./routes');

const app = express();

app.use(routes);

app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
