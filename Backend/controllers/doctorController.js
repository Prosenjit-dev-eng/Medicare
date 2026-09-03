import Doctor from "../models/Doctor.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medicare_jwt_secret_default_key";
// Helper FUnctions
// Convert time string like "10:30 AM" to total minutes since midnight
const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + (mm || 0);
};
// This function takes a schedule object and ensures that each date's slots are unique and sorted in ascending order.
// Return AM or PM time slots in ascending order for each date in the schedule.
function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  if (!schedule || typeof schedule !== "object") return out;
  Object.entries(schedule).forEach(([date, slots]) => {
    if (!Array.isArray(slots)) return;
    const uniq = Array.from(new Set(slots));
    uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    out[date] = uniq;
  });
  return out;
}
// This function takes a schedule input, which can be a stringified JSON or an object, and returns a normalized schedule object with unique and sorted time slots for each date. If the input is a string, it attempts to parse it as JSON. If parsing fails or the input is invalid, it returns an empty object. The resulting schedule is processed through the dedupeAndSortSchedule function to ensure that each date's slots are unique and sorted in ascending order.
function parseScheduleInput(s) {
  if (!s) return {};
  if (typeof s === "string") {
    try {
      s = JSON.parse(s);
    } catch {
      return {};
    }
  }
  return dedupeAndSortSchedule(s || {});
}

function normalizeDocForClient(raw = {}) {
  const doc = { ...raw };

  if (doc.schedule && typeof doc.schedule.forEach === "function") {
    const obj = {};
    doc.schedule.forEach((val, key) => {
      obj[key] = Array.isArray(val) ? val : [];
    });
    doc.schedule = obj;
  } else if (!doc.schedule || typeof doc.schedule !== "object") {
    doc.schedule = {};
  }

  doc.availability = doc.availability === undefined ? "Available" : doc.availability;
  doc.patients = doc.patients ?? "500+";
  doc.rating = doc.rating ?? 4.8;
  doc.fee = doc.fee ?? doc.fees ?? 500;

  return doc;
}

// Create Doctor
export async function createDoctor(req, res) {
  try {
    const body = req.body || {};
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const emailLC = (body.email || "").toLowerCase().trim();
    if (await Doctor.findOne({ email: emailLC })) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists.",
      });
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublicId || null;
    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
      imagePublicId = uploaded?.public_id || uploaded?.publicID || imagePublicId;
    }

    const schedule = parseScheduleInput(body.schedule);

    const doc = new Doctor({
      email: emailLC,
      password: body.password,
      name: body.name.trim(),
      specialization: body.specialization || "General Physician",
      imageUrl,
      imagePublicId,
      availability: body.availability || "Available",
      experience: body.experience || "5+ years",
      qualifications: body.qualifications || "MBBS, MD",
      location: body.location || "Lucknow, India",
      about: body.about || "Dedicated healthcare specialist committed to patient well-being.",
      fee: Number(body.fee) || 500,
      schedule,
      success: body.success || "",
      patients: body.patients || "",
      rating: body.rating !== undefined ? Number(body.rating) : 0,
    });

    await doc.save();
    const secret = process.env.JWT_SECRET;
    if(!secret){
      console.warn("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ success: false, message: "Server configuration error." });
    }
    const token = jwt.sign(
      { id: doc._id.toString(), email: doc.email, role: "doctor" },
      secret,
      { expiresIn: "7d" }
    );

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: out,
      token,
    });
  } catch (err) {
    console.error("CreateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get Doctors with Regex search by name, specialization, etc.
export const getDoctors = async (req, res) => {
  try {
    const { q = "", search = "", specialization = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 200));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const searchTerm = (q || search || "").trim();
    const match = {};

    if (searchTerm) {
      const re = new RegExp(searchTerm, "i");
      match.$or = [{ name: re }, { specialization: re }, { speciality: re }, { location: re }, { qualifications: re }];
    }

    if (specialization && specialization !== "All") {
      match.specialization = new RegExp(specialization.trim(), "i");
    }

    const docs = await Doctor.find(match).select("-password").sort({ name: 1 }).skip(skip).limit(limit).lean();
    const total = await Doctor.countDocuments(match);

    const normalized = docs.map((d) => normalizeDocForClient(d));

    return res.json({
      success: true,
      data: normalized,
      doctors: normalized,
      meta: { page, limit, total, count: normalized.length },
    });
  } catch (err) {
    console.error("getDoctors error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Doctor By ID
export async function getDoctorById(req, res) {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id).select("-password").lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.json({ success: true, data: normalizeDocForClient(doc) });
  } catch (err) {
    console.error("getDoctorById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Update Doctor
export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const existing = await Doctor.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Doctor not found" });

    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      if (uploaded) {
        const previousPublicId = existing.imagePublicId;
        existing.imageUrl = uploaded.secure_url || uploaded.url || existing.imageUrl;
        existing.imagePublicId = uploaded.public_id || uploaded.publicId || existing.imagePublicId;
        if (previousPublicId && previousPublicId !== existing.imagePublicId) {
          deleteFromCloudinary(previousPublicId).catch((e) => console.warn("Cloudinary delete warning:", e?.message || e));
        }
      }
    } else if (body.imageUrl) {
      existing.imageUrl = body.imageUrl;
    }

    if (body.schedule) existing.schedule = parseScheduleInput(body.schedule);

    const updatable = ["name", "specialization", "experience", "qualifications", "location", "about", "fee", "availability", "success", "patients", "rating"];
    updatable.forEach((k) => {
      if (body[k] !== undefined) existing[k] = body[k];
    });

    if (body.email && body.email.toLowerCase() !== existing.email) {
      const other = await Doctor.findOne({ email: body.email.toLowerCase() });
      if (other && other._id.toString() !== id) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      existing.email = body.email.toLowerCase();
    }

    if (body.password) existing.password = body.password;

    await existing.save();

    const out = normalizeDocForClient(existing.toObject());
    delete out.password;
    return res.json({ success: true, message: "Doctor updated successfully", data: out });
  } catch (err) {
    console.error("updateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete Doctor
export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const existing = await Doctor.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Doctor not found." });

    if (existing.imagePublicId) {
      deleteFromCloudinary(existing.imagePublicId).catch((e) => console.warn("Cloudinary cleanup error:", e?.message || e));
    }

    await Doctor.findByIdAndDelete(id);
    return res.json({ success: true, message: "Doctor removed successfully" });
  } catch (err) {
    console.error("deleteDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Toggle Doctor Availability
export async function toggleAvailiablity(req, res) {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found." });

    if (typeof doc.availability === "boolean") {
      doc.availability = !doc.availability ? "Available" : "Unavailable";
    } else {
      doc.availability = doc.availability === "Available" ? "Unavailable" : "Available";
    }

    await doc.save();
    const out = normalizeDocForClient(doc.toObject());
    delete out.password;
    return res.json({ success: true, message: `Availability updated to ${doc.availability}`, data: out });
  } catch (err) {
    console.error("toggleAvailiablity error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Doctor & Admin Login
export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required." });
    }

    const emailClean = email.toLowerCase().trim();

    // Check if Doctor
    const doc = await Doctor.findOne({ email: emailClean }).select("+password");
    if (doc && doc.password === password) {
      const token = jwt.sign(
        { id: doc._id.toString(), email: doc.email, role: "doctor", name: doc.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      const out = normalizeDocForClient(doc.toObject());
      delete out.password;
      return res.json({
        success: true,
        message: "Doctor login successful",
        token,
        role: "doctor",
        doctor: out,
        data: out,
      });
    }

    // Check if Super Admin in User collection or default admin
    if (
      (emailClean === "admin@medicare.com" || emailClean === "admin@gmail.com") &&
      password === "admin123"
    ) {
      const token = jwt.sign(
        { id: "super_admin_001", email: emailClean, role: "admin", name: "Super Admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        message: "Admin login successful",
        token,
        role: "admin",
        doctor: { _id: "super_admin_001", name: "Super Admin", email: emailClean, role: "admin" },
        data: { _id: "super_admin_001", name: "Super Admin", email: emailClean, role: "admin" },
      });
    }

    return res.status(401).json({ success: false, message: "Invalid email or password." });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}