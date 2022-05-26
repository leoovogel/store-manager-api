const database = require('./connect');

function getAllProducts() {
  return database.execute('SELECT * FROM products');
}

function getProductById(id) {
  return database.execute('SELECT * FROM products WHERE id = ?;', [id]);
}

module.exports = {
  getAllProducts,
  getProductById,
};
