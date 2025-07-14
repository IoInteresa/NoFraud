const { addLeadValidator, leadConfirmValidator } = require("../Validators");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { leadService } = require("../Services");

const addLead = async (req, res, next) => {
  try {
    const validation = addLeadValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    const leadId = await leadService.addLead(validation.data);

    return res.status(HttpStatus.OK).json({ leadId });
  } catch (error) {
    next(error);
  }
};

const confirmLead = async (req, res, next) => {
  try {
    const validation = leadConfirmValidator.safeParse(req.body);

    if (!validation.success) {
      throw new ThrowError(HttpStatus.UNPROCESSABLE_ENTITY, validation.error);
    }

    await leadService.confirmLead(validation.data);

    return res.status(HttpStatus.OK).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { addLead, confirmLead };
