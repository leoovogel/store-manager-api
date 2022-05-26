const salesModel = require('../models/sales.model');

function getSales() {
  return salesModel.getAllSales();
}

module.exports = {
  getSales,
};
