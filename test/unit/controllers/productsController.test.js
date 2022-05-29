const { expect } = require('chai');
const sinon = require('sinon');

const productsController = require('../../../controllers/products.controller');
const productsService = require('../../../services/products.service');
const { PRODUCTS_LIST, errorMessages, PRODUCT_1, CREATED_PRODUCT, PRODUCT_3 } = require('../mocks/products.mock');

describe('When calling controller on endpoint GET /products', () => {
  let req = {}, res = {};

  describe('When there is no product registered in the database', () => {
    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(productsService, 'getProducts').resolves([]);
    });

    after(() => {
      productsService.getProducts.restore();
    });

    it('Should return a status code 200', async () => {
      await productsController.getAllProducts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return an empty array', async () => {
      await productsController.getAllProducts(req, res);

      expect(res.json.calledWith([])).to.be.true;
    });
  });

  describe('When there are products registered in the database', () => {
    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(productsService, 'getProducts').resolves(PRODUCTS_LIST);
    });

    after(() => {
      productsService.getProducts.restore();
    });

    it('Should return a status code 200', async () => {
      await productsController.getAllProducts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return an array of products', async () => {
      await productsController.getAllProducts(req, res);

      expect(res.json.calledWith(sinon.match.array)).to.be.true;
      expect(res.json.calledWith(PRODUCTS_LIST)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint GET /products/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the searched product exists in the database', () => {
    before(() => {
      req.params = { id: 1 };
      sinon.stub(productsService, 'getProductById').resolves(PRODUCT_1);
    });

    after(() => {
      productsService.getProductById.restore();
    });

    it('Should return a status code 200', async () => {
      await productsController.getProductById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return the product', async () => {
      await productsController.getProductById(req, res, next);

      expect(res.json.calledWith(PRODUCT_1)).to.be.true;
    });
  });

  describe('When there is no product with the searched id', () => {
    before(() => {
      req.params = { id: 999 };
      sinon.stub(productsService, 'getProductById').resolves();
    });

    after(() => {
      productsService.getProductById.restore();
    });

    it('The error middleware is called with the product not found error object', async () => {
      await productsController.getProductById(req, res, next);

      expect(next.calledWith(errorMessages.PRODUCT_NOT_FOUND)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint POST /products', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the product already exists in the database', () => {
    before(() => {
      req.body = { name: 'Product 1', quantity: 1 };
      sinon.stub(productsService, 'createProduct')
        .resolves({ error: errorMessages.PRODUCT_ALREADY_EXISTS });
    });

    after(() => {
      productsService.createProduct.restore();
    });

    it('The error middleware is called with the product already exists error object', async () => {
      await productsController.createProduct(req, res, next);

      expect(next.calledWith(errorMessages.PRODUCT_ALREADY_EXISTS)).to.be.true;
    });
  });

  describe('When the product does not exist in the database', () => {
    before(() => {
      req.body = { name: 'Product 2', quantity: 1 };
      sinon.stub(productsService, 'createProduct').resolves(CREATED_PRODUCT);
    });

    after(() => {
      productsService.createProduct.restore();
    });

    it('Should return a status code 201', async () => {
      await productsController.createProduct(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Should return the product', async () => {
      await productsController.createProduct(req, res, next);

      expect(res.json.calledWith(CREATED_PRODUCT)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint PUT /products/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the product is not found in the database', () => {
    before(() => {
      req.params = { id: 999 };
      req.body = { name: 'Product 1', quantity: 1 };
      sinon.stub(productsService, 'updateProduct')
        .resolves({ error: errorMessages.PRODUCT_NOT_FOUND });
    });

    after(() => {
      productsService.updateProduct.restore();
    });

    it('The error middleware is called with product not found error object', async () => {
      await productsController.updateProduct(req, res, next);

      expect(next.calledWith(errorMessages.PRODUCT_NOT_FOUND)).to.be.true;
    });
  });

  describe('When for some unknown reason the product is not updated', () => {
    before(() => {
      req.params = { id: 2 };
      req.body = { name: 'Product 2', quantity: 1 };
      sinon.stub(productsService, 'updateProduct').resolves({ error: errorMessages.INTERNAL_SERVER_ERROR });
    });

    after(() => {
      productsService.updateProduct.restore();
    });

    it('The error middleware is called with internal server error object', async () => {
      await productsController.updateProduct(req, res, next);

      expect(next.calledWith(errorMessages.INTERNAL_SERVER_ERROR)).to.be.true;
    });
  });

  describe('When the product is successfully updated', () => {
    before(() => {
      req.params = { id: 3 };
      req.body = { name: 'Product 3', quantity: 3 };
      sinon.stub(productsService, 'updateProduct').resolves(PRODUCT_3);
    });

    after(() => {
      productsService.updateProduct.restore();
    });

    it('Should return a status code 200', async () => {
      await productsController.updateProduct(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return the updated product', async () => {
      await productsController.updateProduct(req, res, next);

      expect(res.json.calledWith(PRODUCT_3)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint DELETE /products/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    res.end = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the product is not found in the database', () => {
    before(() => {
      req.params = { id: 999 };
      sinon.stub(productsService, 'deleteProduct')
        .resolves({ error: errorMessages.PRODUCT_NOT_FOUND });
    });

    after(() => {
      productsService.deleteProduct.restore();
    });

    it('The error middleware is called with product not found error object', async () => {
      await productsController.deleteProduct(req, res, next);

      expect(next.calledWith(errorMessages.PRODUCT_NOT_FOUND)).to.be.true;
    });
  });

  describe('When the product is successfully deleted', () => {
    before(() => {
      req.params = { id: 4 };
      sinon.stub(productsService, 'deleteProduct').resolves([ { affectedRows: 1 } ])
    });

    after(() => {
      productsService.deleteProduct.restore();
    });

    it('Should return a status code 204', async () => {
      await productsController.deleteProduct(req, res, next);

      expect(res.status.calledWith(204)).to.be.true;
    });

    it('Should return the deleted product', async () => {
      await productsController.deleteProduct(req, res, next);

      expect(res.end.calledWith()).to.be.true;
    });
  });
});
