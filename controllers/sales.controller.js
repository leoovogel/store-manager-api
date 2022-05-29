const { StatusCodes } = require('http-status-codes');

const salesService = require('../services/sales.service');
const { SALE_NOT_FOUND } = require('../utils/errorMessages');

async function getSaleById(req, res, next) {
  const { id } = req.params;

  const data = await salesService.getSaleById(id);

  if (!data) {
    return next(SALE_NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json(data);
}

async function getAllSales(_req, res) {
  const data = await salesService.getSales();

  return res.status(StatusCodes.OK).json(data);
}

async function createSale(req, res, next) {
  const products = req.body;

  const data = await salesService.createSale(products);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.CREATED).json(data);
}

async function updateSale(req, res, next) {
  const products = req.body;
  const { id } = req.params;

  const data = await salesService.updateSale(id, products);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.OK).json(data);
}

async function deleteSale(req, res, next) {
  const { id } = req.params;

  const data = await salesService.deleteSale(id);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.NO_CONTENT).end();
}

module.exports = {
  getSaleById,
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
};
