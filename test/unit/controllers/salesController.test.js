const { expect } = require('chai');
const sinon = require('sinon');

const salesController = require('../../../controllers/sales.controller');
const salesService = require('../../../services/sales.service');
const { SALES_LIST, SALE_1, errorMessages, CREATED_SALE, UPDATED_SALE } = require('../mocks/sales.mock');

describe('When calling controller on endpoint GET /sales', () => {
  let req = {}, res = {};
  const err = Error('Server error');

  describe('When there is no sale registered in the database', () => {
    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesService, 'getSales').resolves([]);
    });

    after(() => {
      salesService.getSales.restore();
    });

    it('Should return a status code 200', async () => {
      await salesController.getAllSales(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return an empty array', async () => {
      await salesController.getAllSales(req, res);

      expect(res.json.calledWith([])).to.be.true;
    });
  });

  describe('When there are sales registered in the database', () => {
    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesService, 'getSales').resolves(SALES_LIST);
    });

    after(() => {
      salesService.getSales.restore();
    });

    it('Should return a status code 200', async () => {
      await salesController.getAllSales(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return an array of sales', async () => {
      await salesController.getAllSales(req, res);

      expect(res.json.calledWith(sinon.match.array)).to.be.true;
      expect(res.json.calledWith(SALES_LIST)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint GET /sales/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the searched sale exists in the database', () => {
    before(() => {
      req.params = { id: 1 };
      sinon.stub(salesService, 'getSaleById').resolves(SALE_1);
    });

    after(() => {
      salesService.getSaleById.restore();
    });

    it('Should return a status code 200', async () => {
      await salesController.getSaleById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return the sale', async () => {
      await salesController.getSaleById(req, res, next);

      expect(res.json.calledWith(SALE_1)).to.be.true;
    });
  });

  describe('When there is no sale with the searched id', () => {
    before(() => {
      res.params = { id: 999 };
      sinon.stub(salesService, 'getSaleById').returns(undefined);
    });

    after(() => {
      salesService.getSaleById.restore();
    });

    it('The error middleware is called with the product not found error object', async () => {
      await salesController.getSaleById(req, res, next);

      expect(next.calledWith(errorMessages.SALE_NOT_FOUND)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint POST /sales', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the sale is created', () => {
    before(() => {
      req.body = [ { productId: 1, quantity: 1 } ];
      sinon.stub(salesService, 'createSale').resolves(CREATED_SALE);
    });

    after(() => {
      salesService.createSale.restore();
    });

    it('Should return a status code 201', async () => {
      await salesController.createSale(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Should return the created sale', async () => {
      await salesController.createSale(req, res, next);

      expect(res.json.calledWith(CREATED_SALE)).to.be.true;
    });
  });

  describe('When the sale is not created', () => {
    before(() => {
      req.body = [ { productId: 2, quantity: 999 } ];
      sinon.stub(salesService, 'createSale').returns({ error: errorMessages.INTERNAL_SERVER_ERROR });
    });

    after(() => {
      salesService.createSale.restore();
    });

    it('The error middleware is called with the internal server error object', async () => {
      await salesController.createSale(req, res, next);

      expect(next.calledWith(errorMessages.INTERNAL_SERVER_ERROR)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint PUT /sales/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the sale is not found in the database', () => {
    before(() => {
      req.params = { id: 999 };
      req.body = [ { productId: 1, quantity: 1 } ];
      sinon.stub(salesService, 'updateSale').returns({ error: errorMessages.SALE_NOT_FOUND });
    });

    after(() => {
      salesService.updateSale.restore();
    });

    it('The error middleware is called with the sale not found error object', async () => {
      await salesController.updateSale(req, res, next);

      expect(next.calledWith(errorMessages.SALE_NOT_FOUND)).to.be.true;
    });
  });

  describe('When for some unknown reason the product is not updated', () => {
    before(() => {
      req.params = { id: 2 };
      req.body = [ { productId: 1, quantity: 1 } ];
      sinon.stub(salesService, 'updateSale').returns({ error: errorMessages.INTERNAL_SERVER_ERROR });
    });

    after(() => {
      salesService.updateSale.restore();
    });

    it('The error middleware is called with internal server error object', async () => {
      await salesController.updateSale(req, res, next);

      expect(next.calledWith(errorMessages.INTERNAL_SERVER_ERROR)).to.be.true;
    });
  });

  describe('When the sale is successfully updated', () => {
    before(() => {
      req.params = { id: 4 };
      req.body = [ { productId: 2, quantity: 3 } ];
      sinon.stub(salesService, 'updateSale').resolves(UPDATED_SALE);
    });

    after(() => {
      salesService.updateSale.restore();
    });

    it('Should return a status code 200', async () => {
      await salesController.updateSale(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Should return the updated sale', async () => {
      await salesController.updateSale(req, res, next);

      expect(res.json.calledWith(UPDATED_SALE)).to.be.true;
    });
  });
});

describe('When calling controller on endpoint DELETE /sales/:id', () => {
  let req = {}, res = {}, next;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    res.end = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('When the sale is not found in the database', () => {
    before(() => {
      req.params = { id: 999 };
      sinon.stub(salesService, 'deleteSale').returns({ error: errorMessages.SALE_NOT_FOUND });
    });

    after(() => {
      salesService.deleteSale.restore();
    });

    it('The error middleware is called with the sale not found error object', async () => {
      await salesController.deleteSale(req, res, next);

      expect(next.calledWith(errorMessages.SALE_NOT_FOUND)).to.be.true;
    });
  });

  describe('When the sale is successfully deleted', () => {
    before(() => {
      req.params = { id: 2 };
      sinon.stub(salesService, 'deleteSale').returns({ });
    });

    after(() => {
      salesService.deleteSale.restore();
    });

    it('Should return a status code 204', async () => {
      await salesController.deleteSale(req, res, next);

      expect(res.status.calledWith(204)).to.be.true;
    });
  });
});
