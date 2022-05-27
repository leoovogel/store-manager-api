module.exports = {
  INTERNAL_SERVER_ERROR: { status: 500, message: 'Internal server error' },
  PRODUCT_NOT_FOUND: { status: 404, message: 'Product not found' },
  SALE_NOT_FOUND: { status: 404, message: 'Sale not found' },
  INSUFFICIENT_QUANTITY: { status: 422, message: 'Such amount is not permitted to sell' },
  PRODUCT_ALREADY_EXISTS: { status: 409, message: 'Product already exists' },
};
