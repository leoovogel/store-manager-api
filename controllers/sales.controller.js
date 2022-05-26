const express = require('express');
const rescue = require('express-rescue');
const { StatusCodes } = require('http-status-codes');

const salesService = require('../services/sales.service');
const validateSale = require('../middlewares/validateSale');
const { SALE_NOT_FOUND } = require('../utils/errorMessages');

const router = express.Router();

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const [sales] = await salesService.getSaleById(id);

  if (!sales.length) {
    return next(SALE_NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json(sales);
}));

router.get('/', rescue(async (_req, res) => {
  const [sales] = await salesService.getSales();

  return res.status(StatusCodes.OK).json(sales);
}));

router.post('/', validateSale, rescue(async (req, res, next) => {
  const products = req.body;

  const data = await salesService.createSale(products);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.CREATED).json(data);
}));

router.put('/:id', validateSale, rescue(async (req, res, next) => {
  const products = req.body;
  const { id } = req.params;

  const data = await salesService.updateSale(id, products);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.OK).json(data);
}));

module.exports = router;
