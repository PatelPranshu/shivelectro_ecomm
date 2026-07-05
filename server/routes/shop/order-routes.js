const express = require("express");

const {
  createRazorpayOrder,    // --- UPDATED ---
  verifyRazorpayPayment,  // --- UPDATED ---
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const featureGate = require("../../helpers/featureGate");

const router = express.Router();

// --- UPDATED ROUTES ---
router.post("/create-razorpay-order", authMiddleware, featureGate("showCheckout"), createRazorpayOrder);
router.post("/verify-razorpay-payment", authMiddleware, featureGate("showCheckout"), verifyRazorpayPayment);

// These routes remain the same
router.get("/list/:userId", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", authMiddleware, getOrderDetails);

module.exports = router;