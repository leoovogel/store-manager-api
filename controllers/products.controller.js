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

router.post('/', validateProduct, rescue(async (req, res, next) => {
  const { name, quantity } = req.body;

  const data = await productsService.createProduct({ name, quantity });

  if (data.error) return next(data.error);

  return res.status(StatusCodes.CREATED).json(data);
}));

router.put('/:id', validateProduct, rescue(async (req, res, next) => {
  const { name, quantity } = req.body;
  const { id } = req.params;

  const data = await productsService.updateProduct({ id, name, quantity });

  if (data.error) return next(data.error);

  return res.status(StatusCodes.OK).json(data);
}));

router.delete('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const data = await productsService.deleteProduct(id);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.NO_CONTENT).end();
}));

module.exports = router;
