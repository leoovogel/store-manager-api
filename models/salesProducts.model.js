const database = require('./connect');

function bindSaleWithProducts(saleId, product) {
  return database.execute(`
    INSERT INTO
      sales_products(sale_id, product_id, quantity)
    VALUES
      (?, ?, ?)`,
    [saleId, product.productId, product.quantity]);
}

function updateSales(saleId, productId, quantity) {
  return database.execute(`
    UPDATE
      sales_products
    SET
      quantity = ?
    WHERE
      sale_id = ? AND
      product_id = ?`,
    [quantity, saleId, productId]);
}

function deleteSale(id) {
  return database.execute(`
    DELETE FROM
      sales_products
    WHERE
      sale_id = ?`,
    [id]);
}

module.exports = {
  bindSaleWithProducts,
  updateSales,
  deleteSale,
};
