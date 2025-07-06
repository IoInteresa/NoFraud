const { Router } = require("express");

const { googleSheetController } = require("../Controllers");

const router = Router();

router.post("/add", googleSheetController.addToSheet);
router.post("/confirm", googleSheetController.confirmSheetVerification);

module.exports = router;
