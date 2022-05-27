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

function getProductByName(name) {
  return database.execute(`
    SELECT * FROM products
    WHERE
      name = ?`,
    [name]);
}

function createProduct(product) {
  return database.execute(`
    INSERT INTO
      products(name, quantity)
    VALUES
      (?, ?)`,
    [product.name, product.quantity]);
}

function updateProduct(product) {
  return database.execute(`
    UPDATE
      products
    SET
      name = ?,
      quantity = ?
    WHERE
      id = ?`,
    [product.name, product.quantity, product.id]);
}

function deleteProduct(id) {
  return database.execute(`
    DELETE FROM
      products
    WHERE
      id = ?`,
    [id]);
}

function updateProductQuantityInStock(productId, quantity) {
  return database.execute(`
    UPDATE
      products
    SET
      quantity = quantity + ?
    WHERE
      id = ?`,
    [quantity, productId]);
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantityInStock,
};
