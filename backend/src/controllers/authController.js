const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Cookie configuration
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      enrollmentNumber,
      vendorId,
    } = req.body;

    // Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      enrollmentNumber,
      vendorId,
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Store JWT in cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { loginId, password, role } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide ID and password",
      });
    }

    // Find user based on role
    const user = await User.findOne(
      role === "student"
        ? {
            enrollmentNumber: loginId,
            role: "student",
          }
        : {
            vendorId: loginId,
            role: "vendor",
          }
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid ID or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid ID or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Store JWT in cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Logout User
const logoutUser = (req, res) => {
  const options = getCookieOptions();

  res.clearCookie("token", {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
  });

  return res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};