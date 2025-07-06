const { sendCodeValidator, checkCodeValidator } = require("../Validators");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { verificationService } = require("../Services");

const sendCode = async (req, res, next) => {
  try {
    const validation = sendCodeValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    await verificationService.sendCode(validation.data);

    return res.status(HttpStatus.OK).json();
  } catch (error) {
    next(error);
  }
};

const checkCode = async (req, res, next) => {
  try {
    const validation = checkCodeValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    await verificationService.checkCode(validation.data);

    return res.status(HttpStatus.OK).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { sendCode, checkCode };
