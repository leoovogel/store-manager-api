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

router.post('/', validateSale, rescue(async (req, res, _next) => {
  const { name, quantity } = req.body;
  console.log(name, quantity);

  return res.status(StatusCodes.CREATED).json({ message: 'success' });
}));

router.put('/:id', validateSale, rescue(async (req, res, _next) => {
  const { name, quantity } = req.body;
  console.log(name, quantity);

  return res.status(StatusCodes.OK).json({ message: 'success' });
}));

module.exports = router;
