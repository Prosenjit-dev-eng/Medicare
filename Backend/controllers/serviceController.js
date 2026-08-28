import Service from "../models/Service.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const parseJsonArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return typeof parsed === "string" ? [parsed] : [];
    } catch {
      return field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

function normalizeSlotsToMap(slotStrings = []) {
  const map = {};
  if (!Array.isArray(slotStrings)) return map;
  slotStrings.forEach((raw) => {
    if (!raw || typeof raw !== "string") return;
    const m = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) {
      map["General Slots"] = map["General Slots"] || [];
      map["General Slots"].push(raw);
      return;
    }
    const [, day, monShort, year, hour, minute, ampm] = m;
    const monthIdx = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].findIndex(
      (x) => x.toLowerCase() === monShort.toLowerCase()
    );
    const mm = String(monthIdx >= 0 ? monthIdx + 1 : 1).padStart(2, "0");
    const dd = String(Number(day)).padStart(2, "0");
    const dateKey = `${year}-${mm}-${dd}`;
    const timeStr = `${String(Number(hour)).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm.toUpperCase()}`;
    map[dateKey] = map[dateKey] || [];
    map[dateKey].push(timeStr);
  });
  return map;
}

const sanitizePrice = (v) => Number(String(v ?? "0").replace(/[^\d.-]/g, "")) || 0;

export async function createService(req, res) {
  try {
    const b = req.body || {};
    if (!b.name) {
      return res.status(400).json({ success: false, message: "Service name is required." });
    }

    const instructions = parseJsonArrayField(b.instructions);
    const rawSlots = parseJsonArrayField(b.slots);
    const slots = normalizeSlotsToMap(rawSlots);
    const numericPrice = sanitizePrice(b.price);
    const available = b.available !== false && b.available !== "false";

    let imageUrl = b.imageUrl || null;
    let imagePublicId = b.imagePublicId || null;

    if (req.file?.path) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || up?.url || imageUrl;
        imagePublicId = up?.public_id || imagePublicId;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const service = new Service({
      name: b.name.trim(),
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericPrice,
      available,
      instructions,
      slots,
      imageUrl,
      imagePublicId,
    });

    const saved = await service.save();
    return res.status(201).json({
      success: true,
      message: "Diagnostic Service Created",
      data: saved,
      service: saved,
    });
  } catch (err) {
    console.error("CreateService Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getServices = async (req, res) => {
  try {
    const { q = "", search = "", limit: limitRaw = 100, page: pageRaw = 1 } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 100));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const searchTerm = (q || search || "").trim();
    const match = {};

    if (searchTerm) {
      const re = new RegExp(searchTerm, "i");
      match.$or = [{ name: re }, { shortDescription: re }, { about: re }];
    }

    const services = await Service.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Service.countDocuments(match);

    return res.json({
      success: true,
      data: services,
      services,
      meta: { page, limit, total, count: services.length },
    });
  } catch (err) {
    console.error("getServices Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const item = await Service.findById(id).lean();
    if (!item) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    return res.json({ success: true, data: item, service: item });
  } catch (err) {
    console.error("getServiceById Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const b = req.body || {};

    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (req.file?.path) {
      const up = await uploadToCloudinary(req.file.path, "services");
      if (up) {
        const prevId = existing.imagePublicId;
        existing.imageUrl = up.secure_url || up.url || existing.imageUrl;
        existing.imagePublicId = up.public_id || existing.imagePublicId;
        if (prevId && prevId !== existing.imagePublicId) {
          deleteFromCloudinary(prevId).catch((e) => console.warn(e));
        }
      }
    } else if (b.imageUrl) {
      existing.imageUrl = b.imageUrl;
    }

    if (b.name !== undefined) existing.name = b.name.trim();
    if (b.about !== undefined) existing.about = b.about;
    if (b.shortDescription !== undefined) existing.shortDescription = b.shortDescription;
    if (b.price !== undefined) existing.price = sanitizePrice(b.price);
    if (b.available !== undefined) existing.available = b.available !== false && b.available !== "false";
    if (b.instructions !== undefined) existing.instructions = parseJsonArrayField(b.instructions);
    if (b.slots !== undefined) existing.slots = normalizeSlotsToMap(parseJsonArrayField(b.slots));

    const updated = await existing.save();
    return res.json({
      success: true,
      message: "Service updated successfully",
      data: updated,
      service: updated,
    });
  } catch (err) {
    console.error("updateService Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (existing.imagePublicId) {
      deleteFromCloudinary(existing.imagePublicId).catch((e) => console.warn(e));
    }

    await Service.findByIdAndDelete(id);
    return res.json({ success: true, message: "Service removed successfully" });
  } catch (err) {
    console.error("deleteService Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}