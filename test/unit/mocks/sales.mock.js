const errorMessages = {
  INTERNAL_SERVER_ERROR: { status: 500, message: 'Internal server error' },
  SALE_NOT_FOUND: { status: 404, message: 'Sale not found' },
}

const SALE_1 = { "saleId": 1, "date": "2021-09-09T04:54:29.000Z", "productId": 1, "quantity": 1 };
const SALE_2 = { "saleId": 2, "date": "2021-09-09T04:54:54.000Z", "productId": 2, "quantity": 2 };
const CREATED_SALE = { "id": 4, "itemsSold": [ { "productId": 1, "quantity": 1 } ] };
const UPDATED_SALE = { "id": 4, "itemUpdated": [ { "productId": 2, "quantity": 3 } ] };

const SALES_LIST = [SALE_1, SALE_2];

module.exports = {
  errorMessages,
  SALE_1,
  SALE_2,
  CREATED_SALE,
  UPDATED_SALE,
  SALES_LIST,
}
