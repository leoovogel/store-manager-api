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

async function updateProduct(product) {
  const [result] = await productsModel.getProductById(product.id);

  if (!result.length) {
    return { error: { status: 404, message: 'Product not found' } };
  }

  const [data] = await productsModel.updateProduct(product);

  if (!data.affectedRows) {
    return { error: { status: 500, message: 'Internal server error' } };
  }

  return product;
}

async function deleteProduct(id) {
  const [result] = await productsModel.getProductById(id);

  if (!result.length) {
    return { error: { status: 404, message: 'Product not found' } };
  }
  
  return productsModel.deleteProduct(id);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
