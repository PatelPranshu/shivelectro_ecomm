const express = require("express");

const {
  createRazorpayOrder,    // --- UPDATED ---
  verifyRazorpayPayment,  // --- UPDATED ---
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

// --- UPDATED ROUTES ---
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-razorpay-payment", verifyRazorpayPayment);

// These routes remain the same
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;