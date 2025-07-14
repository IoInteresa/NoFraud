const { Router } = require("express");

const { leadController } = require("../Controllers");

const router = Router();

router.post("/add", leadController.addLead);
router.post("/confirm", leadController.confirmLead);

module.exports = router;
