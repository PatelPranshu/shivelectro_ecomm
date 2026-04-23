const express = require("express");
const { getSiteConfig } = require("../../controllers/admin/modes-controller");

const router = express.Router();

// Public route — no auth required
// Frontend fetches this on app startup to know which features to show
router.get("/get", getSiteConfig);

module.exports = router;
