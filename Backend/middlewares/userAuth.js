import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "medicare_jwt_secret_default_key";

export default async function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Check if user exists in DB
    const userDoc = await User.findById(decoded.id).select("-password");
    if (userDoc) {
      req.currentUser = userDoc;
    }

    next();
  } catch (err) {
    console.error("User auth error:", err?.message || err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
