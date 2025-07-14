const { Router } = require("express");

const { productController } = require("../Controllers");

const router = Router();

router.post("/status", productController.getStatus);

module.exports = router;
