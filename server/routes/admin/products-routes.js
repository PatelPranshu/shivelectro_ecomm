const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const { authMiddleware, isAdminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/upload-image", authMiddleware, isAdminMiddleware, upload.single("my_file"), handleImageUpload);
router.post("/add", authMiddleware, isAdminMiddleware, addProduct);
router.put("/edit/:id", authMiddleware, isAdminMiddleware, editProduct);
router.delete("/delete/:id", authMiddleware, isAdminMiddleware, deleteProduct);
router.get("/get", authMiddleware, isAdminMiddleware, fetchAllProducts);

module.exports = router;
