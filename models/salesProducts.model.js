const database = require('./connect');

function bindSaleWithProducts(saleId, product) {
  return database.execute(`
    INSERT INTO
      sales_products(sale_id, product_id, quantity)
    VALUES
      (?, ?, ?)`,
    [saleId, product.productId, product.quantity]);
}

module.exports = {
  bindSaleWithProducts,
};
