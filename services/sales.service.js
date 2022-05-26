const salesModel = require('../models/sales.model');
const salesProductModel = require('../models/salesProducts.model');

function getSales() {
  return salesModel.getAllSales();
}

function getSaleById(id) {
  return salesModel.getSaleById(id);
}

async function createSale(products) {
  const [sale] = await salesModel.createSale();

  if (!sale.insertId) {
    return { error: { status: 500, message: 'Internal server error' } };
  }

  const bindPromises = products.map(({ productId, quantity }) => (
    salesProductModel.bindSaleWithProducts(sale.insertId, { productId, quantity })
  ));

  await Promise.all(bindPromises);

  return {
    id: sale.insertId,
    itemsSold: products,
  };
}

async function updateSale(saleId, products) {
  const [result] = await salesModel.getSaleById(saleId);

  if (!result.length) {
    return { error: { status: 404, message: 'Sale not found' } };
  }

  const updateSalePromises = products.map(({ productId, quantity }) => (
    salesProductModel.updateSales(saleId, productId, quantity)
  ));

  await Promise.all(updateSalePromises);

  return { saleId, itemUpdated: products };
}

module.exports = {
  getSales,
  getSaleById,
  createSale,
  updateSale,
};
