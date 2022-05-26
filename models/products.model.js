const database = require('./connect');

function getAllProducts() {
  return database.execute('SELECT * FROM products');
}

function getProductById(id) {
  return database.execute(`
    SELECT * FROM products
    WHERE
      id = ?`,
    [id]);
}

function createProduct(product) {
  return database.execute(`
    INSERT INTO
      products(name, quantity)
    VALUES
      (?, ?)`,
    [product.name, product.quantity]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};
