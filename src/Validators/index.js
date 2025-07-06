const { z } = require("zod/v4");

const sendCodeValidator = z.object({
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),
  productId: z.number(),
});

const checkCodeValidator = z.object({
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),
  code: z.string().regex(/^\d{4}$/),
  productId: z.number(),
});

const addToSheetValidator = z.object({
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),
  name: z.string(),
  email: z.string(),
  productId: z.number(),
});

const sheetConfirmValidator = z.object({
  id: z.string(),
  productId: z.number(),
});

module.exports = {
  sendCodeValidator,
  checkCodeValidator,
  addToSheetValidator,
  sheetConfirmValidator,
};
