const productsModel = require('../models/products.model');

function getProducts() {
  return productsModel.getAllProducts();
}

module.exports = {
  getProducts,
};
