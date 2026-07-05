const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    specifications: String,
    otherDetails: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    isFeature: Boolean,
    freeDelivery: { type: Boolean, default: false },
    warranty: String,
    cashOnDelivery: { type: Boolean, default: false },
    returnPolicy: String,
    secureTransaction: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
