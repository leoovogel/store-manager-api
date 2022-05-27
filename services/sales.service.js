const salesModel = require('../models/sales.model');
const salesProductModel = require('../models/salesProducts.model');
const productsModel = require('../models/products.model');

function getSales() {
  return salesModel.getAllSales();
}

function getSaleById(id) {
  return salesModel.getSaleById(id);
}

async function createSale(products) {
  const productsInStock = await Promise.all(products
    .map(({ productId }) => productsModel.getProductById(productId)));

  const allProductsIsInStock = productsInStock
    .map((product) => product[0][0])
    .every(({ quantity }, index) => quantity >= products[index].quantity);

  if (!allProductsIsInStock) {
    return { error: { status: 422, message: 'Such amount is not permitted to sell' } };
  }

  const [sale] = await salesModel.createSale();

  if (!sale.insertId) {
    return { error: { status: 500, message: 'Internal server error' } };
  }

  const bindPromises = products.map(({ productId, quantity }) => (
    salesProductModel.bindSaleWithProducts(sale.insertId, { productId, quantity })
  ));
  await Promise.all(bindPromises);

  const updateProductsInStock = products.map(({ productId, quantity }) => {
    const updateQuantity = quantity * -1;
    return productsModel.updateProductQuantityInStock(productId, updateQuantity);
  });
  Promise.all(updateProductsInStock);

  return { id: sale.insertId, itemsSold: products };
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

  const updateProductsInStock = products.map(({ productId, quantity }) => {
    const updateQuantity = result.find(({ productId: id }) => id === productId).quantity - quantity;

    return productsModel.updateProductQuantityInStock(productId, updateQuantity);
  });

  Promise.all(updateProductsInStock);

  return { saleId, itemUpdated: products };
}

async function deleteSale(id) {
  const [products] = await salesModel.getSaleById(id);

  if (!products.length) {
    return { error: { status: 404, message: 'Sale not found' } };
  }

  await salesProductModel.deleteSale(id);
  await salesModel.deleteSale(id);

  const updateProductsInStock = products.map(({ productId, quantity }) => (
    productsModel.updateProductQuantityInStock(productId, quantity)
  ));

  Promise.all(updateProductsInStock);

  return {};
}

module.exports = {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
