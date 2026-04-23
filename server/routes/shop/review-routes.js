const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const featureGate = require("../../helpers/featureGate");

const router = express.Router();

// Submitting reviews is gated - reading reviews stays open
router.post("/add", featureGate("showReviews"), addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
