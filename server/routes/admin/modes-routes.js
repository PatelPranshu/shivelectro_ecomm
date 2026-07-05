const express = require("express");
const { authMiddleware, isAdminMiddleware } = require("../../controllers/auth/auth-controller");
const {
  getSiteConfig,
  updateSiteConfig,
} = require("../../controllers/admin/modes-controller");

const router = express.Router();

// Both routes require authentication
router.get("/get", getSiteConfig);
router.put("/update", authMiddleware, isAdminMiddleware, updateSiteConfig);

module.exports = router;
