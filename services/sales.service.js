const salesModel = require('../models/sales.model');
const salesProductModel = require('../models/salesProducts.model');

function getSales() {
  return salesModel.getAllSales();
}

function getSaleById(id) {
  return salesModel.getSaleById(id);
}

async function createSale(sales) {
  const [sale] = await salesModel.createSale();

  if (!sale.insertId) {
    return { error: { status: 500, message: 'Internal server error' } };
  }

  const bindPromises = sales.map(({ productId, quantity }) => (
    salesProductModel.bindSaleWithProducts(sale.insertId, { productId, quantity })
  ));

  await Promise.all(bindPromises);

  return {
    id: sale.insertId,
    itemsSold: sales,
  };
}

module.exports = {
  getSales,
  getSaleById,
  createSale,
};
