const express = require('express');

const router = express.Router();

router.use('/products', require('./controllers/products.controller'));
router.use('/sales', require('./controllers/sales.controller'));

module.exports = router;
