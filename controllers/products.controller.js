const express = require('express');
const rescue = require('express-rescue');
const { StatusCodes } = require('http-status-codes');

const productsService = require('../services/products.service');
const validateProduct = require('../middlewares/validateProduct');
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

router.post('/', validateProduct, rescue(async (req, res, _next) => {
  const { name, quantity } = req.body;

  const newProduct = await productsService.createProduct({ name, quantity });

  return res.status(StatusCodes.CREATED).json(newProduct);
}));

router.put('/:id', validateProduct, rescue(async (req, res, _next) => {
  const { name, quantity } = req.body;
  console.log(name, quantity);

  return res.status(StatusCodes.OK).json({ message: 'success' });
}));

module.exports = router;
