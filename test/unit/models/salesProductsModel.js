const { expect } = require('chai');
const sinon = require('sinon');

const database = require('../../../models/connect');
const salesProductsModel = require('../../../models/salesProducts.model');

describe('Bind sales with products', () => {
  const BIND_SALE_PRODUCTS_ARGS = [ 1, { productId: 1, quantity: 1 } ]
  const BIND_SALE_PRODUCTS_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the sale is successfully bound with products', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[BIND_SALE_PRODUCTS_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await salesProductsModel.bindSaleWithProducts(...BIND_SALE_PRODUCTS_ARGS);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an affectedRows key with the value 1', async () => {
      const result = await salesProductsModel.bindSaleWithProducts(...BIND_SALE_PRODUCTS_ARGS);

      expect(result[0][0]).to.have.property('affectedRows', 1);
    });
  });
});

describe('Update a sale', () => {
  const UPDATE_SALE_ARGS = [ 1, 1, 20 ]
  const UPDATE_SALE_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 1  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 1
  };

  describe('When the sale is successfully updated', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[UPDATE_SALE_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await salesProductsModel.updateSales(...UPDATE_SALE_ARGS);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an changedRows key with the value 1', async () => {
      const result = await salesProductsModel.updateSales(...UPDATE_SALE_ARGS);

      expect(result[0][0]).to.have.property('changedRows', 1);
    });
  });
});

describe('Delete a sale', () => {
  const DELETE_SALE_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the sale is successfully deleted', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[DELETE_SALE_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await salesProductsModel.deleteSale(1);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an affectedRows key with the value 1', async () => {
      const result = await salesProductsModel.deleteSale(1);

      expect(result[0][0]).to.have.property('affectedRows', 1);
    });
  });
});
