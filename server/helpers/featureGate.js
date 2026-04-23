const SiteConfig = require("../models/SiteConfig");

/**
 * Middleware factory that blocks requests when a feature is disabled.
 * Usage: router.post("/add", featureGate("showAddToCart"), addToCart);
 *
 * If the feature flag is false in DB, returns 403 Forbidden.
 * This is the server-side security layer — even if the frontend is hacked,
 * disabled features cannot be used.
 *
 * @param {string} featureKey - The SiteConfig field name to check
 */
function featureGate(featureKey) {
  return async (req, res, next) => {
    try {
      const config = await SiteConfig.findOne();

      // If no config exists yet, allow everything (defaults to enabled)
      if (!config) {
        return next();
      }

      if (config[featureKey] === false) {
        return res.status(403).json({
          success: false,
          message: "This feature is currently disabled by the administrator.",
        });
      }

      next();
    } catch (error) {
      console.log("featureGate error:", error);
      // On error, fail open to not break the site
      next();
    }
  };
}

module.exports = featureGate;
