const { uid } = require("uid");

const { productsDao } = require("../Dao");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { GoogleSheetManager } = require("../Utilities");
const { getDateUTC5 } = require("../Helpers");

const addToSheet = async ({ phoneNumber, name, email, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  const googleSheetManager = new GoogleSheetManager();

  await googleSheetManager.initialize(product.name);

  const id = await googleSheetManager.addRow({
    id: uid(14),
    email,
    phoneNumber,
    name,
    confirmed: false,
    date: getDateUTC5(),
  });

  return id;
};

const confirmSheetVerification = async ({ id, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  const googleSheetManager = new GoogleSheetManager();

  await googleSheetManager.initialize(product.name);
  await googleSheetManager.updateConfirmed(id);
};

module.exports = { addToSheet, confirmSheetVerification };
