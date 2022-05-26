const express = require('express');

const routes = require('./routes');
const error = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use(routes);

app.use(error);

app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
