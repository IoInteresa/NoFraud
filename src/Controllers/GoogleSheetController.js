const { addToSheetValidator, sheetConfirmValidator } = require("../Validators");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { googleSheetService } = require("../Services");

const addToSheet = async (req, res, next) => {
  try {
    const validation = addToSheetValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    const rowId = await googleSheetService.addToSheet(validation.data);

    return res.status(HttpStatus.OK).json({ rowId });
  } catch (error) {
    next(error);
  }
};

const confirmSheetVerification = async (req, res, next) => {
  try {
    const validation = sheetConfirmValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    await googleSheetService.confirmSheetVerification(validation.data);

    return res.status(HttpStatus.OK).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { addToSheet, confirmSheetVerification };
