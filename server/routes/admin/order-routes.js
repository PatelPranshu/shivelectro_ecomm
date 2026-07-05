const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");
const { authMiddleware, isAdminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get", authMiddleware, isAdminMiddleware, getAllOrdersOfAllUsers);
router.get("/details/:id", authMiddleware, isAdminMiddleware, getOrderDetailsForAdmin);
router.put("/update/:id", authMiddleware, isAdminMiddleware, updateOrderStatus);

module.exports = router;
