import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "medicare_jwt_secret_default_key";

// Register Patient or Admin
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "patient", phone = "", age = null, gender = "" } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const user = new User({
      name: name.trim(),
      email: emailNormalized,
      password, // in production hash with bcrypt
      role,
      phone,
      age,
      gender,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login Patient or Admin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNormalized }).select("+password");

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("getUserProfile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// List all users (for Admin dashboard)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete user (Super Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
