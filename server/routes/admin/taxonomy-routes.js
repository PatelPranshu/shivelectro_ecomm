const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  addCategory,
  deleteCategory,
  addBrand,
  deleteBrand,
} = require("../../controllers/admin/taxonomy-controller");

const router = express.Router();

router.post("/category/add", authMiddleware, addCategory);
router.delete("/category/delete/:id", authMiddleware, deleteCategory);

router.post("/brand/add", authMiddleware, addBrand);
router.delete("/brand/delete/:id", authMiddleware, deleteBrand);

module.exports = router;
