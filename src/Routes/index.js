const { Router } = require("express");

const verificationRoutes = require("./VerificationRoutes");
const leadRoutes = require("./LeadRoutes");
const productRoutes = require("./ProductRoutes");

const router = Router();

router.use("/verification", verificationRoutes);
router.use("/lead", leadRoutes);
router.use("/product", productRoutes);

module.exports = router;
