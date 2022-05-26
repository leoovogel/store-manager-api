const express = require('express');
const { StatusCodes } = require('http-status-codes');

const productsService = require('../services/products.service');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const [product] = await productsService.getProductById(id);

  res.status(StatusCodes.OK).json(product[0]);
});

router.get('/', async (_req, res) => {
  const [products] = await productsService.getProducts();

  res.status(StatusCodes.OK).json(products);
});

module.exports = router;
