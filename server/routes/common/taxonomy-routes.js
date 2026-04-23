const express = require("express");
const { getTaxonomy } = require("../../controllers/admin/taxonomy-controller");

const router = express.Router();

// Public route to fetch all categories and brands
router.get("/get", getTaxonomy);

module.exports = router;
