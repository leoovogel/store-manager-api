const database = require('./connect');

function getAllSales() {
  return database.execute(`
    SELECT
      sale_id AS saleId, date, product_id AS productId, quantity
    FROM
      sales
    JOIN
      sales_products AS sp
    ON
      sales.id = sp.sale_id
    ORDER BY
      sale_id, product_id`);
}

module.exports = {
  getAllSales,
};
