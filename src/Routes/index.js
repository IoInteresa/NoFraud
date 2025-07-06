const { Router } = require("express");

const verificationRoutes = require("./VerificationRoutes");
const googleSheetRoutes = require("./GoogleSheetRoutes");

const router = Router();

router.use("/verification", verificationRoutes);
router.use("/googleSheet", googleSheetRoutes);

module.exports = router;
