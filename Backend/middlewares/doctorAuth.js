import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";

const JWT_SECRET = process.env.JWT_SECRET || "medicare_jwt_secret_default_key";

export default async function doctorAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Doctor not authorized, token missing.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role && payload.role !== "doctor" && payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor privileges required.",
      });
    }

    const doctor = await Doctor.findById(payload.id).select("-password");
    if (!doctor) {
      // Allow super-admin access or return doctor not found
      if (payload.role === "admin") {
        req.doctor = { _id: payload.id, role: "admin", name: "Super Admin" };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Doctor JWT Verification failed:", error?.message || error);
    return res.status(401).json({
      success: false,
      message: "Token invalid, missing, or expired.",
    });
  }
}