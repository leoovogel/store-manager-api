const { expect } = require('chai');
const sinon = require('sinon');

const database = require('../../../models/connect');
const salesModel = require('../../../models/sales.model');
const { SALE_1, SALE_2 } = require('../mocks/sales.mock');

describe('List all sales in the database', () => {
  describe('When there is no sale registered in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should return an empty array', async () => {
      const result = await salesModel.getAllSales();

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).to.be.empty;
    });
  });

  describe('When there are sales registered in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[SALE_1, SALE_2], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array where index 0 is an array of objects', async () => {
      const result = await salesModel.getAllSales();

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).not.to.be.empty;

      result[0].forEach((sale) => expect(sale).to.be.an('object'));
    });

    it('Each object in the array must have the saleId, date, productId and quantity keys', async () => {
      const result = await salesModel.getAllSales();

      result[0].forEach((sale) => expect(sale).to.include.all.keys('saleId', 'date', 'productId', 'quantity'));
    });
  });
});

describe('Get sale by id', () => {
  describe('When there is no sale with the searched id', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should return an empty array', async () => {
      const result = await salesModel.getSaleById(999);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).to.be.empty;
    });
  });

  describe('When the searched sale exists in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[SALE_1], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array where index 0 is an array with only one object', async () => {
      const result = await salesModel.getSaleById(1);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).not.to.be.empty;

      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object in the array must have the saleId, date, productId and quantity keys', async () => {
      const result = await salesModel.getSaleById(1);

      expect(result[0][0]).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });
});

describe('Create a new sale', () => {
  const CREATED_SALE_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 3,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the sale is created successfully', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[CREATED_SALE_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await salesModel.createSale();

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an insertId key with a value other than 0', async () => {
      const result = await salesModel.createSale();

      expect(result[0][0]).to.have.property('insertId');
      expect(result[0][0].insertId).to.be.a('number');
      expect(result[0][0].insertId).to.not.equal(0);
    });
  });
});

describe('Delete a sale', () => {
  const DELETED_SALE_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  }

  describe('When the sale is deleted successfully', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[DELETED_SALE_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await salesModel.deleteSale(1);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an affectedRows key with the value 1', async () => {
      const result = await salesModel.deleteSale(1);

      expect(result[0][0]).to.have.property('affectedRows', 1);
    });
  });
});
