const axios = require("axios");

const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { verificationDao, productsDao } = require("../Dao");
const { MAX_VERIFICATIONS_PER_DAY } = require("../Constants");
const {
  PLUSOFON_API_KEY,
  PLUSOFON_API_URL,
  PLUSOFON_CLIENT_ID,
} = require("../environments");

const sendCode = async ({ phoneNumber, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  const todayVerificationCount =
    await verificationDao.getTodayVerificationCount({ phoneNumber, productId });

  if (todayVerificationCount > MAX_VERIFICATIONS_PER_DAY) {
    throw new ThrowError(
      HttpStatus.TOO_MANY_VERIFICATIONS,
      `Too many verifications today for ${phoneNumber}`
    );
  }

  const sendCodeResponse = await axios.post(
    `${PLUSOFON_API_URL}/send`,
    {
      phone: phoneNumber,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PLUSOFON_API_KEY}`,
        Client: PLUSOFON_CLIENT_ID,
      },
      validateStatus: () => true,
    }
  );

  const {
    data: { pin },
    success,
  } = sendCodeResponse.data;

  if (!success) {
    throw new ThrowError(
      HttpStatus.CAN_NOT_SEND_CODE,
      `Can not send code to ${phoneNumber}`
    );
  }

  if (!pin) {
    throw new ThrowError(
      HttpStatus.PIN_IS_EMPTY_IN_RESPONSE,
      `Pin is empty in response for ${phoneNumber}`
    );
  }

  await verificationDao.createVerification({
    phoneNumber,
    code: pin,
    productId,
  });
};

const checkCode = async ({ phoneNumber, code, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  const verification = await verificationDao.getVerification({
    phoneNumber,
    productId,
  });

  if (!verification) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Verification not found for ${phoneNumber}`
    );
  }

  if (verification.code !== Number(code)) {
    throw new ThrowError(
      HttpStatus.INVALID_VERIFICATION_CODE,
      `Invalid code for ${phoneNumber}`
    );
  }

  await verificationDao.updateVerification({
    id: verification.id,
  });
};

module.exports = {
  sendCode,
  checkCode,
};
