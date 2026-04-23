const mongoose = require("mongoose");

const SiteConfigSchema = new mongoose.Schema(
  {
    showPrice: { type: Boolean, default: true },
    showAddToCart: { type: Boolean, default: true },
    showCart: { type: Boolean, default: true },
    showCheckout: { type: Boolean, default: true },
    showReviews: { type: Boolean, default: true },
    showLogin: { type: Boolean, default: true },
    showRegistration: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SiteConfig = mongoose.model("SiteConfig", SiteConfigSchema);
module.exports = SiteConfig;
