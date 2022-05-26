const productsModel = require('../models/products.model');

function getProducts() {
  return productsModel.getAllProducts();
}

function getProductById(id) {
  return productsModel.getProductById(id);
}

async function createProduct({ name, quantity }) {
  const [product] = await productsModel.getProductByName(name);

  if (product.length) {
    return { error: { status: 409, message: 'Product already exists' } };
  }

  const [newProduct] = await productsModel.createProduct({ name, quantity });
  return { id: newProduct.insertId, name, quantity };
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
