const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const adminModesRouter = require("./routes/admin/modes-routes");
const siteConfigRouter = require("./routes/common/site-config-routes");
const adminTaxonomyRouter = require("./routes/admin/taxonomy-routes");
const commonTaxonomyRouter = require("./routes/common/taxonomy-routes");

require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
const PORT = process.env.PORT || 5000;
const dbHost = process.env.DB_HOST;
var timeInMss = new Date();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
});


mongoose
  .connect(dbHost)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));


app.get("/", (req, res) => {
  res.send("Welcome to the Shivelectro");
});


console.log(`Server started at ${timeInMss}`);

// Using comma-separated env values like your laboratory-management project, 
// with a fallback to your existing variables
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
  : [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_VERCEL,
    ].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Return false to gracefully block unauthorized origins without crashing the server (500 Error)
      return callback(null, false); 
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
    optionsSuccessStatus: 200 // Ensure success status for legacy browsers
  })
);


app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authLimiter);
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/modes", adminModesRouter);
app.use("/api/admin/taxonomy", adminTaxonomyRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/common/site-config", siteConfigRouter);
app.use("/api/common/taxonomy", commonTaxonomyRouter);


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.listen(PORT, '0.0.0.0', () => console.log(`Server is now running on port ${PORT}`));
