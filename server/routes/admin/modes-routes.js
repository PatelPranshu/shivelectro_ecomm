const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  getSiteConfig,
  updateSiteConfig,
} = require("../../controllers/admin/modes-controller");

const router = express.Router();

// Both routes require authentication (admin check is handled by CheckAuth on frontend,
// and additionally we verify role in the middleware)
router.get("/get", authMiddleware, getSiteConfig);
router.put("/update", authMiddleware, updateSiteConfig);

module.exports = router;
