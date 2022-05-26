const express = require('express');
const { StatusCodes } = require('http-status-codes');

const productsService = require('../services/products.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const [products] = await productsService.getProducts();

  res.status(StatusCodes.OK).json(products);
});

module.exports = router;
