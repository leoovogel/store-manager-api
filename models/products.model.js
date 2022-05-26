const database = require('./connect');

function getAllProducts() {
  return database.execute('SELECT * FROM products');
}

module.exports = {
  getAllProducts,
};
