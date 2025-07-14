const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { productsDao } = require("../Dao");

const setActive = async ({ productId, value }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  await productsDao.setProductActivation(productId, value);
};

const getStatus = async ({ productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  return product.isActive;
};

module.exports = { setActive, getStatus };
