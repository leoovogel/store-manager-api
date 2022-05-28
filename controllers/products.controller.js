const { StatusCodes } = require('http-status-codes');

const productsService = require('../services/products.service');
const { PRODUCT_NOT_FOUND } = require('../utils/errorMessages');

async function getProductById(req, res, next) {
  const { id } = req.params;

  const [product] = await productsService.getProductById(id);

  if (!product.length) {
    return next(PRODUCT_NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json(product[0]);
}

async function getAllProducts(_req, res) {
  const [products] = await productsService.getProducts();

  res.status(StatusCodes.OK).json(products);
}

async function createProduct(req, res, next) {
  const { name, quantity } = req.body;

  const data = await productsService.createProduct({ name, quantity });

  if (data.error) return next(data.error);

  return res.status(StatusCodes.CREATED).json(data);
}

async function updateProduct(req, res, next) {
  const { name, quantity } = req.body;
  const { id } = req.params;

  const data = await productsService.updateProduct({ id, name, quantity });

  if (data.error) return next(data.error);

  return res.status(StatusCodes.OK).json(data);
}

async function deleteProduct(req, res, next) {
  const { id } = req.params;

  const data = await productsService.deleteProduct(id);

  if (data.error) return next(data.error);

  return res.status(StatusCodes.NO_CONTENT).end();
}

module.exports = {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
