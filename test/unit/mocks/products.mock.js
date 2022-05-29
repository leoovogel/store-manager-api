const errorMessages = {
  PRODUCT_NOT_FOUND: { status: 404, message: 'Product not found' },
  PRODUCT_ALREADY_EXISTS: { status: 409, message: 'Product already exists' },
  INTERNAL_SERVER_ERROR: { status: 500, message: 'Internal server error' },
}

const PRODUCT_1 = { "id": 1, "name": "Martelo de Thor", "quantity": 10 };
const PRODUCT_2 = { "id": 2, "name": "Traje de encolhimento", "quantity": 20 };
const PRODUCT_3 = { "id": 3, "name": "Product 3", "quantity": 3 };
const CREATED_PRODUCT = { "id": 3, "name": "Product 2", "quantity": 1 };

const PRODUCTS_LIST = [PRODUCT_1, PRODUCT_2];

module.exports = {
  errorMessages,
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  CREATED_PRODUCT,
  PRODUCTS_LIST,
}
