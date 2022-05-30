const { expect } = require('chai');
const sinon = require('sinon');

const productsModel = require('../../../models/products.model');
const productsService = require('../../../services/products.service');
const { PRODUCT_1, PRODUCT_2, errorMessages } = require('../mocks/products.mock');

describe('Get products', () => {
  describe('When there is no product registered in the database', () => {
    before(() => {
      sinon.stub(productsModel, 'getAllProducts').resolves([[], []]);
    });

    after(() => {
      productsModel.getAllProducts.restore();
    });

    it('Should return an empty array', async () => {
      const result = await productsService.getProducts();

      expect(result).to.be.an('array');
      expect(result).to.be.empty;
    });
  });

  describe('When there are products registered in the database', () => {
    before(() => {
      sinon.stub(productsModel, 'getAllProducts').resolves([[PRODUCT_1, PRODUCT_2], []]);
    });

    after(() => {
      productsModel.getAllProducts.restore();
    });

    it('Should returns an array of objects', async () => {
      const result = await productsService.getProducts();

      expect(result).to.be.an('array');
      expect(result).not.to.be.empty;

      result.forEach((product) => expect(product).to.be.an('object'));
    });

    it('Each object in the array must have the id, name and quantity keys', async () => {
      const result = await productsService.getProducts();

      result.forEach((product) => expect(product).to.include.all.keys('id', 'name', 'quantity'));
    });
  });
});

describe('Get product by id', () => {
  describe('When there is no product with the searched id', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[], []]);
    });

    after(() => {
      productsModel.getProductById.restore();
    });

    it('Should return undefined', async () => {
      const result = await productsService.getProductById(999);

      expect(result).to.be.undefined;
    });
  });

  describe('When there is a product with the searched id', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1], []]);
    });

    after(() => {
      productsModel.getProductById.restore();
    });

    it('Should returns an object', async () => {
      const result = await productsService.getProductById(1);

      expect(result).to.be.an('object');
    });

    it('The object must have the id, name and quantity keys', async () => {
      const result = await productsService.getProductById(1);

      expect(result).to.include.all.keys('id', 'name', 'quantity');
    });
  });
});

describe('Create a product', () => {
  const CREATED_PRODUCT_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 4,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  describe('When the product already exists in the database', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductByName').resolves([[PRODUCT_1], []]);
    });

    after(() => {
      productsModel.getProductByName.restore();
    });

    it('Should return an error object', async () => {
      const result = await productsService.createProduct({ name: 'Product 1', quantity: 1 });

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.PRODUCT_ALREADY_EXISTS);
    });
  });

  describe('When the product is successfully created', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductByName').resolves([[], []]);
      sinon.stub(productsModel, 'createProduct').resolves([CREATED_PRODUCT_MODEL_RETURN, undefined]);
    });

    after(() => {
      productsModel.getProductByName.restore();
      productsModel.createProduct.restore();
    });

    it('Should return the created product', async () => {
      const result = await productsService.createProduct({ name: 'Product 3', quantity: 1 });

      expect(result).to.be.an('object');
      expect(result).to.have.property('id', 4);
      expect(result).to.have.property('name', 'Product 3');
      expect(result).to.have.property('quantity', 1);
    });
  });
});

describe('Update a product', () => {
  const UPDATED_PRODUCT_MODEL_SUCCESS = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  };

  const UPDATED_PRODUCT_MODEL_FAILURE = {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  }

  describe('When the product does not exist in the database', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[], []]);
    });

    after(() => {
      productsModel.getProductById.restore();
    });

    it('Should return an error object', async () => {
      const result = await productsService.updateProduct({ id: 999, name: 'Product 1', quantity: 1 });

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.PRODUCT_NOT_FOUND);
    });
  });

  describe('When for some reason the product has not been updated', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1], []]);
      sinon.stub(productsModel, 'updateProduct').resolves([UPDATED_PRODUCT_MODEL_FAILURE, undefined]);
    });

    after(() => {
      productsModel.getProductById.restore();
      productsModel.updateProduct.restore();
    });

    it('Should return an error object', async () => {
      const result = await productsService.updateProduct({ id: 1, name: 'Product 1', quantity: 1 });

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.INTERNAL_SERVER_ERROR);
    });
  });

  describe('When the product is successfully updated', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1], []]);
      sinon.stub(productsModel, 'updateProduct').resolves([UPDATED_PRODUCT_MODEL_SUCCESS, undefined]);
    });

    after(() => {
      productsModel.getProductById.restore();
      productsModel.updateProduct.restore();
    });

    it('Should return the updated product', async () => {
      const result = await productsService.updateProduct({ id: 1, name: 'Product 1', quantity: 1 });

      expect(result).to.be.an('object');
      expect(result).to.have.property('id', 1);
      expect(result).to.have.property('name', 'Product 1');
      expect(result).to.have.property('quantity', 1);
    });
  });
});

describe('Delete a product', () => {
  const DELETED_PRODUCT_MODEL_RETURN = {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  }

  describe('When the product does not exist in the database', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[], []]);
    });

    after(() => {
      productsModel.getProductById.restore();
    });

    it('Should return an error object', async () => {
      const result = await productsService.deleteProduct(999);

      expect(result).to.be.an('object');
      expect(result).to.have.deep.property('error', errorMessages.PRODUCT_NOT_FOUND);
    });
  });

  describe('When the product is successfully deleted', () => {
    before(() => {
      sinon.stub(productsModel, 'getProductById').resolves([[PRODUCT_1], []]);
      sinon.stub(productsModel, 'deleteProduct').resolves([DELETED_PRODUCT_MODEL_RETURN, undefined]);
    });

    after(() => {
      productsModel.getProductById.restore();
      productsModel.deleteProduct.restore();
    });

    it('Should return an error object', async () => {
      const [result] = await productsService.deleteProduct(1);

      expect(result).to.be.an('object');
      expect(result).to.have.property('affectedRows', 1);
    });
  });
});
