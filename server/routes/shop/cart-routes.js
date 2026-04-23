const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const featureGate = require("../../helpers/featureGate");

const router = express.Router();

// All cart operations are gated behind showCart
// addToCart is additionally gated behind showAddToCart
router.post("/add", featureGate("showCart"), featureGate("showAddToCart"), addToCart);
router.get("/get/:userId", featureGate("showCart"), fetchCartItems);
router.put("/update-cart", featureGate("showCart"), updateCartItemQty);
router.delete("/:userId/:productId", featureGate("showCart"), deleteCartItem);

module.exports = router;
