const express = require("express");

const { searchProducts } = require("../../controllers/shop/search-controller");
const featureGate = require("../../helpers/featureGate");

const router = express.Router();

router.get("/:keyword", featureGate("showSearch"), searchProducts);

module.exports = router;
