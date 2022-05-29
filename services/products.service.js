const productsModel = require('../models/products.model');
const {
  PRODUCT_ALREADY_EXISTS, PRODUCT_NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/errorMessages');

async function getProducts() {
  const [products] = await productsModel.getAllProducts();
  return products;
}

async function getProductById(id) {
  const [product] = await productsModel.getProductById(id);
  return product[0];
}

async function createProduct({ name, quantity }) {
  const [product] = await productsModel.getProductByName(name);

  if (product.length) return { error: PRODUCT_ALREADY_EXISTS };

  const [newProduct] = await productsModel.createProduct({ name, quantity });
  return { id: newProduct.insertId, name, quantity };
}

async function updateProduct(product) {
  const [result] = await productsModel.getProductById(product.id);

  if (!result.length) return { error: PRODUCT_NOT_FOUND };

  const [data] = await productsModel.updateProduct(product);

  if (!data.affectedRows) return { error: INTERNAL_SERVER_ERROR };

  return product;
}

async function deleteProduct(id) {
  const [result] = await productsModel.getProductById(id);

  if (!result.length) return { error: PRODUCT_NOT_FOUND };

  return productsModel.deleteProduct(id);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
