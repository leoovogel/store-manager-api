const express = require('express');
const rescue = require('express-rescue');

const validateProduct = require('./middlewares/validateProduct');
const validateSale = require('./middlewares/validateSale');

const router = express.Router();

const productsController = require('./controllers/products.controller');
const salesController = require('./controllers/sales.controller');

router.get('/products', rescue(productsController.getAllProducts));
router.get('/products/:id', rescue(productsController.getProductById));
router.post('/products', validateProduct, rescue(productsController.createProduct));
router.put('/products/:id', validateProduct, rescue(productsController.updateProduct));
router.delete('/products/:id', rescue(productsController.deleteProduct));

router.get('/sales', rescue(salesController.getAllSales));
router.get('/sales/:id', rescue(salesController.getSaleById));
router.post('/sales', validateSale, rescue(salesController.createSale));
router.put('/sales/:id', validateSale, rescue(salesController.updateSale));
router.delete('/sales/:id', rescue(salesController.deleteSale));

module.exports = router;
