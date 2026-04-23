const SiteConfig = require("../../models/SiteConfig");

// Get current site config
const getSiteConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();

    // If no config exists, create one with all defaults (true)
    if (!config) {
      config = await SiteConfig.create({});
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.log("getSiteConfig error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site configuration.",
    });
  }
};

// Update site config (admin only)
const updateSiteConfig = async (req, res) => {
  try {
    // Only allow whitelisted fields to be updated
    const allowedFields = [
      "showPrice",
      "showAddToCart",
      "showCart",
      "showCheckout",
      "showReviews",
      "showLogin",
      "showRegistration",
      "showSearch",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (typeof req.body[field] === "boolean") {
        updates[field] = req.body[field];
      }
    }

    let config = await SiteConfig.findOne();

    if (!config) {
      config = await SiteConfig.create(updates);
    } else {
      Object.assign(config, updates);
      await config.save();
    }

    res.status(200).json({
      success: true,
      data: config,
      message: "Site configuration updated successfully.",
    });
  } catch (error) {
    console.log("updateSiteConfig error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update site configuration.",
    });
  }
};

module.exports = { getSiteConfig, updateSiteConfig };
