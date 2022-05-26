const express = require('express');
const rescue = require('express-rescue');
const { StatusCodes } = require('http-status-codes');

const productsService = require('../services/products.service');
const { PRODUCT_NOT_FOUND } = require('../utils/errorMessages');

const router = express.Router();

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const [product] = await productsService.getProductById(id);

  if (!product.length) {
    return next(PRODUCT_NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json(product[0]);
}));

router.get('/', rescue(async (_req, res) => {
  const [products] = await productsService.getProducts();

  res.status(StatusCodes.OK).json(products);
}));

module.exports = router;
