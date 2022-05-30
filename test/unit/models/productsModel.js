const { expect } = require('chai');
const sinon = require('sinon');

const database = require('../../../models/connect');
const productsModel = require('../../../models/products.model');
const { PRODUCT_1, PRODUCT_2 } = require('../mocks/products.mock');

describe('List all products in the database', () => {
  describe('When there is no product registered in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should return an empty array', async () => {
      const result = await productsModel.getAllProducts();

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).to.be.empty;
    });
  });

  describe('When there are products registered in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[PRODUCT_1, PRODUCT_2], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array where index 0 is an array of objects', async () => {
      const result = await productsModel.getAllProducts();

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).not.to.be.empty;

      result[0].forEach((product) => expect(product).to.be.an('object'));
    });

    it('Each object in the array must have the id, name and quantity keys', async () => {
      const result = await productsModel.getAllProducts();

      result[0].forEach((product) => expect(product).to.include.all.keys('id', 'name', 'quantity'));
    });
  });
});

describe('Get product by id', () => {
  describe('When there is no product with the searched id', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an empty array', async () => {
      const result = await productsModel.getProductById(999);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).to.be.empty;
    });
  });

  describe('When the searched product exists in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[PRODUCT_1], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array where index 0 is an array with only one object', async () => {
      const result = await productsModel.getProductById(1);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).not.to.be.empty;

      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object in the array must have the id, name and quantity keys', async () => {
      const result = await productsModel.getProductById(1);

      expect(result[0][0]).to.include.all.keys('id', 'name', 'quantity');
    });
  });
});

describe('Get product by name', () => {
  describe('When there is no product with the searched name', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an empty array', async () => {
      const result = await productsModel.getProductByName('Product does not exist');

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).to.be.empty;
    });
  });

  describe('When the searched product exists in the database', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[PRODUCT_1], []]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array where index 0 is an array with only one object', async () => {
      const result = await productsModel.getProductByName('Martelo de Thor');

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[1]).to.be.an('array');
      expect(result[0]).not.to.be.empty;

      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object in the array must have the id, name and quantity keys', async () => {
      const result = await productsModel.getProductByName('Martelo de Thor');

      expect(result[0][0]).to.include.all.keys('id', 'name', 'quantity');
    });
  });
});

describe('Create a new product', () => {
  const CREATED_PRODUCT_ARGS = { name: 'Martelo de Thor', quantity: 1 };
  const CREATED_PRODUCT_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 4,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the product is successfully created', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[CREATED_PRODUCT_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await productsModel.createProduct(CREATED_PRODUCT_ARGS);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an insertId key with a value other than 0', async () => {
      const result = await productsModel.createProduct(CREATED_PRODUCT_ARGS);

      expect(result[0][0]).to.have.property('insertId');
      expect(result[0][0].insertId).to.be.a('number');
      expect(result[0][0].insertId).to.not.equal(0);
    });
  });
});

describe('Update a product', () => {
  const UPDATED_PRODUCT_ARGS = { id: 1, name: 'Martelo de Thor', quantity: 1 };
  const UPDATED_PRODUCT_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the product is successfully updated', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[UPDATED_PRODUCT_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await productsModel.updateProduct(UPDATED_PRODUCT_ARGS);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an affectedRows key with the value 1', async () => {
      const result = await productsModel.updateProduct(UPDATED_PRODUCT_ARGS);

      expect(result[0][0]).to.have.property('affectedRows', 1);
    });
  });
});

describe('Delete a product', () => {
  const DELETED_PRODUCT_ARGS = { id: 1 };
  const DELETED_PRODUCT_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the product is successfully deleted', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[DELETED_PRODUCT_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await productsModel.deleteProduct(DELETED_PRODUCT_ARGS);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an affectedRows key with the value 1', async () => {
      const result = await productsModel.deleteProduct(DELETED_PRODUCT_ARGS);

      expect(result[0][0]).to.have.property('affectedRows', 1);
    });
  });
});

describe('Update a product quantity', () => {
  const UPDATED_PRODUCT_QUANTITY_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 1  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 1
  };

  describe('When the product quantity is successfully updated', () => {
    before(() => {
      sinon.stub(database, 'execute').resolves([[UPDATED_PRODUCT_QUANTITY_MODEL_RETURN], undefined]);
    });

    after(() => {
      database.execute.restore();
    });

    it('Should returns an array with only one object', async () => {
      const result = await productsModel.updateProductQuantityInStock(1, 3);

      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('array');
      expect(result[0]).not.to.be.empty;
      expect(result[0][0]).to.be.an('object');
      expect(result[0][1]).to.be.undefined;
    });

    it('The object must have an changedRows key with the value 1', async () => {
      const result = await productsModel.updateProductQuantityInStock(1, 3);

      expect(result[0][0]).to.have.property('changedRows', 1);
    });
  });
});
