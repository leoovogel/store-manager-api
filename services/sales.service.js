const salesModel = require('../models/sales.model');

function getSales() {
  return salesModel.getAllSales();
}

function getSaleById(id) {
  return salesModel.getSaleById(id);
}

module.exports = {
  getSales,
  getSaleById,
};
