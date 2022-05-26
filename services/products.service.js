const productsModel = require('../models/products.model');

function getProducts() {
  return productsModel.getAllProducts();
}

function getProductById(id) {
  return productsModel.getProductById(id);
}

module.exports = {
  getProducts,
  getProductById,
};
