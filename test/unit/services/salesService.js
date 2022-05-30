const { expect } = require('chai');
const sinon = require('sinon');

const salesProductModel = require('../../../models/salesProducts.model');
const productsModel = require('../../../models/products.model');
const salesModel = require('../../../models/sales.model');
const salesService = require('../../../services/sales.service');
const { PRODUCT_1 } = require('../mocks/products.mock');
const { SALE_1, SALE_2, errorMessages } = require('../mocks/sales.mock');

describe('Get sales', () => {
  describe('When there is no sale registered in the database', () => {
    before(() => {
      sinon.stub(salesModel, 'getAllSales').resolves([[], []]);
    });

    after(() => {
      salesModel.getAllSales.restore();
    });

    it('Should return an empty array', async () => {
      const result = await salesService.getSales();

      expect(result).to.be.an('array');
      expect(result).to.be.empty;
    });
  });

  describe('When there are sale registered in the database', () => {
    before(() => {
      sinon.stub(salesModel, 'getAllSales').resolves([[SALE_1, SALE_2], []]);
    });

    after(() => {
      salesModel.getAllSales.restore();
    });

    it('Should returns an array of objects', async () => {
      const result = await salesService.getSales();

      expect(result).to.be.an('array');
      expect(result).not.to.be.empty;

      result.forEach((sale) => expect(sale).to.be.an('object'));
    });

    it('Each object in the array must have the saleId, date, productId and quantity keys', async () => {
      const result = await salesService.getSales();

      result.forEach((sale) => expect(sale).to.include.all.keys('saleId', 'date', 'productId', 'quantity'));
    });
  });
});

describe('Get sales by id', () => {
  describe('When there is no sale with the searched id', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[], []]);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('Should return an empty array', async () => {
      const result = await salesService.getSaleById(999);

      expect(result).to.be.an('array');
      expect(result).to.be.empty;
    });
  });

  describe('When there is a sale with the searched id', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[SALE_1], []]);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('Should returns an array of objects', async () => {
      const result = await salesService.getSaleById(1);

      expect(result).to.be.an('array');
      expect(result).not.to.be.empty;

      result.forEach((sale) => expect(sale).to.be.an('object'));
    });

    it('Every object in the array must have the saleId, date, productId and quantity keys', async () => {
      const result = await salesService.getSaleById(1);
      
      expect(result).not.to.be.empty;
      result.forEach((sale) => expect(sale).to.include.all.keys('saleId', 'date', 'productId', 'quantity'));
    });
  });
});

describe('Create a sale', () => {
  const CREATED_SALE_MODEL_FAILURE = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  const CREATED_SALE_MODEL_SUCCESS = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 4,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When there is not enough product stock', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1, []]]);
    });

    after(() => {
      productsModel.getProductById.restore();
    });

    it('Should return the error object informing insufficient amount', async () => {
      const result = await salesService.createSale([ { productId: 1, quantity: 200 } ]);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.INSUFFICIENT_QUANTITY);
    });
  });

  describe('When for some reason the sale is not created', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1, []]]);
      sinon.stub(salesModel, 'createSale').resolves([CREATED_SALE_MODEL_FAILURE, []]);
    });

    after(() => {
      productsModel.getProductById.restore();
      salesModel.createSale.restore();
    });

    it('Should return an error object', async () => {
      const result = await salesService.createSale([ { productId: 1, quantity: 1 } ]);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.INTERNAL_SERVER_ERROR);
    });
  });

  describe('When the sale is successfully created', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1, []]]);
      sinon.stub(salesModel, 'createSale').resolves([CREATED_SALE_MODEL_SUCCESS, []]);
      sinon.stub(salesProductModel, 'bindSaleWithProducts').resolves([[], []]);
    });

    after(() => {
      productsModel.getProductById.restore();
      salesModel.createSale.restore();
    });

    it('Should return an object with id and itemsSold array', async () => {
      const result = await salesService.createSale([ { productId: 1, quantity: 1 } ]);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('id', 4);
      expect(result).to.have.deep.property('itemsSold', [ { productId: 1, quantity: 1 } ]);
    });
  })
});

describe('Update a sale', () => {
  const UPDATED_SALE_MODEL_SUCCESS = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the sale is not found', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[], []]);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('Should return the error object informing the sale was not found', async () => {
      const result = await salesService.updateSale(999, [ { productId: 1, quantity: 1 } ]);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.SALE_NOT_FOUND);
    });
  });

  describe('When the sale is successfully updated', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[SALE_1], []]);
      sinon.stub(salesProductModel, 'updateSales').resolves([[UPDATED_SALE_MODEL_SUCCESS, []]]);
    });

    after(() => {
      salesModel.getSaleById.restore();
      salesProductModel.updateSales.restore();
    });

    it('Should return an object with the updated saleId and itemUpdated array', async () => {
      const result = await salesService.updateSale(1, [ { productId: 1, quantity: 1 } ]);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('saleId', 1);
      expect(result).to.have.deep.property('itemUpdated', [ { productId: 1, quantity: 1 } ]);
    });
  });
});

describe('Delete a sale', () => {
  const DELETED_SALE_MODEL_SUCCESS = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the sale is not found', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[], []]);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('Should return the error object informing the sale was not found', async () => {
      const result = await salesService.deleteSale(999);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.SALE_NOT_FOUND);
    });
  });

  describe('When the sale is successfully deleted', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves([[SALE_1], []]);
      sinon.stub(salesModel, 'deleteSale').resolves([[DELETED_SALE_MODEL_SUCCESS, []]]);
      sinon.stub(salesProductModel, 'deleteSale').resolves([[DELETED_SALE_MODEL_SUCCESS, []]]);
    });

    after(() => {
      salesModel.getSaleById.restore();
      salesModel.deleteSale.restore();
      salesProductModel.deleteSale.restore();
    });

    it('Should return an empty object', async () => {
      const result = await salesService.deleteSale(1);

      expect(result).to.be.an('object');
      expect(result).to.be.empty;
    });
  });
});
