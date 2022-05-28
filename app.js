const express = require('express');

const app = express();

app.use(express.json());

app.use(require('./routes'));

app.use(require('./middlewares/error'));

app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
