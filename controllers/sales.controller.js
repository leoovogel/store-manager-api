const express = require('express');
const rescue = require('express-rescue');
const { StatusCodes } = require('http-status-codes');

const salesService = require('../services/sales.service');

const router = express.Router();

router.get('/:id', rescue(async (req, res) => {
  const { id } = req.params;

  const [sales] = await salesService.getSaleById(id);

  res.status(StatusCodes.OK).json(sales);
}));

router.get('/', rescue(async (_req, res) => {
  const [sales] = await salesService.getSales();

  res.status(StatusCodes.OK).json(sales);
}));

module.exports = router;
