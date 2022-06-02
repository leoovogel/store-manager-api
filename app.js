const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

app.use(require('./routes'));

app.use(require('./middlewares/error'));

app.get('/', (_request, response) => {
  response.send();
});

app.use('/', swaggerUi.serve, swaggerUi.setup(require('./utils/swagger.json')));

module.exports = app;
