const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

app.use(require('./routes'));

app.use(require('./middlewares/error'));

app.use('/', swaggerUi.serve, swaggerUi.setup(require('./utils/swagger.json')));

app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
