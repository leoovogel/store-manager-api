const express = require('express');

const router = express.Router();

router.use('/products', require('./controllers/products.controller'));

module.exports = router;
