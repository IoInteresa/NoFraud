const { Router } = require("express");

const { verificationController } = require("../Controllers");

const router = Router();

router.post("/sendCode", verificationController.sendCode);
router.post("/checkCode", verificationController.checkCode);

module.exports = router;
