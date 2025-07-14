const { getStatusValidator } = require("../Validators");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { productService } = require("../Services");

const getStatus = async (req, res, next) => {
  try {
    const validation = getStatusValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    const status = await productService.getStatus(validation.data);

    return res.status(HttpStatus.OK).json({ status });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStatus };
