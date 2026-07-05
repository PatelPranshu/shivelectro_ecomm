const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const User = require("../../models/User");
const SiteConfig = require("../../models/SiteConfig");

const registerSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

   const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "Invalid email or password! Please try again",
      });

    // Check if login is disabled for regular users
    const siteConfig = await SiteConfig.findOne();
    if (siteConfig && siteConfig.showLogin === false && checkUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "User login is currently disabled by admin.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Invalid email or password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m", algorithm: "HS256" }
    );

    const isProduction = process.env.NODE_ENV === "production" && process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith('https:');

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: isProduction, 
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 3600000 // 1 hour
    }).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production" && process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith('https:');

  res.clearCookie("token", { 
    httpOnly: true, 
    secure: isProduction, 
    sameSite: isProduction ? 'none' : 'lax'
  }).json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    
    // Enforce global logout for normal users if login mode is turned off
    if (decoded.role !== 'admin') {
      const siteConfig = await SiteConfig.findOne();
      if (siteConfig && siteConfig.showLogin === false) {
        const isProduction = process.env.NODE_ENV === "production" && process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith('https:');
        return res.status(401).clearCookie("token", { 
          httpOnly: true, 
          secure: isProduction, 
          sameSite: isProduction ? 'none' : 'lax'
        }).json({
          success: false,
          message: "User login is disabled by admin. You have been logged out.",
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

const isAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, isAdminMiddleware };
