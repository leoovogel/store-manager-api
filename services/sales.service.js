const salesModel = require('../models/sales.model');
const salesProductModel = require('../models/salesProducts.model');
const productsModel = require('../models/products.model');
const {
  INTERNAL_SERVER_ERROR, INSUFFICIENT_QUANTITY, SALE_NOT_FOUND,
} = require('../utils/errorMessages');

async function getSales() {
  const [sales] = await salesModel.getAllSales();
  return sales;
}

async function getSaleById(id) {
  const [sale] = await salesModel.getSaleById(id);
  return sale;
}

async function createSale(products) {
  const productsInStock = await Promise.all(products
    .map(({ productId }) => productsModel.getProductById(productId)));

  const allProductsIsInStock = productsInStock
    .map((product) => product[0][0])
    .every(({ quantity }, index) => quantity >= products[index].quantity);

  if (!allProductsIsInStock) return { error: INSUFFICIENT_QUANTITY };

  const [sale] = await salesModel.createSale();

  if (!sale.insertId) return { error: INTERNAL_SERVER_ERROR };

  await Promise.all(products.map(({ productId, quantity }) => (
    salesProductModel.bindSaleWithProducts(sale.insertId, { productId, quantity })
  )));

  Promise.all(products.map(({ productId, quantity }) => {
    const updateQuantity = quantity * -1;
    return productsModel.updateProductQuantityInStock(productId, updateQuantity);
  }));

  return { id: sale.insertId, itemsSold: products };
}

async function updateSale(saleId, products) {
  const [result] = await salesModel.getSaleById(saleId);

  if (!result.length) return { error: SALE_NOT_FOUND };

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

  if (!products.length) return { error: SALE_NOT_FOUND };

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
