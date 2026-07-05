const express = require("express");
const { authMiddleware, isAdminMiddleware } = require("../../controllers/auth/auth-controller");
const {
  addCategory,
  deleteCategory,
  addBrand,
  deleteBrand,
} = require("../../controllers/admin/taxonomy-controller");

const router = express.Router();

router.post("/category/add", authMiddleware, isAdminMiddleware, addCategory);
router.delete("/category/delete/:id", authMiddleware, isAdminMiddleware, deleteCategory);

router.post("/brand/add", authMiddleware, isAdminMiddleware, addBrand);
router.delete("/brand/delete/:id", authMiddleware, isAdminMiddleware, deleteBrand);

module.exports = router;
