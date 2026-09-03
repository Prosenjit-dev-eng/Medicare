import ServiceAppointment from "../models/serviceAppointment.js";
import Service from "../models/Service.js";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || null;
const stripeInstance = stripeKey ? new Stripe(stripeKey) : null;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  return "http://localhost:5173";
};

// Create Service Appointment
export const createServiceAppointment = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      serviceId,
      patientName,
      email = "",
      mobile,
      age,
      gender = "",
      date,
      time = "",
      paymentMethod = "Online",
      fees,
      notes = "",
      createdBy,
    } = body;

    if (!serviceId || !patientName || !mobile || !date) {
      return res.status(400).json({
        success: false,
        message: "Service, patient name, mobile, and date are required.",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Diagnostic service not found" });
    }

    const cost = Number(fees) || Number(service.price) || 499;
    const userId = createdBy || req.user?.id || req.auth?.userId || "guest_patient";

    const newAppointment = new ServiceAppointment({
      createdBy: userId,
      patientName: patientName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      age: Number(age) || null,
      gender,
      serviceId: service._id,
      serviceName: service.name,
      serviceImage: {
        url: service.imageUrl || "",
        publicId: service.imagePublicId || "",
      },
      fees: cost,
      date,
      time: time || "10:00 AM",
      notes,
      status: paymentMethod === "Cash" ? "Confirmed" : "Pending",
      payment: {
        method: paymentMethod,
        status: paymentMethod === "Cash" ? "Paid" : "Pending",
        amount: cost,
      },
    });

    if (paymentMethod === "Online" && stripeInstance) {
      const frontendBase = buildFrontendBase(req);
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Diagnostic Service: ${service.name}`,
                description: `Scheduled for ${date} at ${time || "Morning"}`,
                images: service.imageUrl ? [service.imageUrl] : [],
              },
              unit_amount: Math.round(cost * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${frontendBase}/appointments?session_id={CHECKOUT_SESSION_ID}&service_appointment_id=${newAppointment._id}&status=success`,
        cancel_url: `${frontendBase}/appointments?status=cancelled`,
        metadata: {
          serviceAppointmentId: newAppointment._id.toString(),
          serviceId: service._id.toString(),
          patientName,
          type: "service_booking",
        },
      });

      newAppointment.payment.sessionId = session.id;
      await newAppointment.save();

      return res.status(201).json({
        success: true,
        message: "Service booking created, redirecting to payment",
        appointment: newAppointment,
        sessionId: session.id,
        checkoutUrl: session.url,
        url: session.url,
      });
    }

    await newAppointment.save();
    return res.status(201).json({
      success: true,
      message: "Service booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("createServiceAppointment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Confirm Service Payment
export const confirmServicePayment = async (req, res) => {
  try {
    const { session_id, service_appointment_id } = req.query;
    const sessionId = session_id || req.body?.sessionId;
    const appointmentId = service_appointment_id || req.body?.appointmentId;

    let appointment = null;
    if (appointmentId) {
      appointment = await ServiceAppointment.findById(appointmentId);
    } else if (sessionId) {
      appointment = await ServiceAppointment.findOne({ "payment.sessionId": sessionId });
    }

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Service booking not found" });
    }

    if (stripeInstance && sessionId) {
      try {
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          appointment.payment.status = "Paid";
          appointment.status = "Confirmed";
          appointment.payment.paidAt = new Date();
          appointment.payment.providerId = session.payment_intent || session.id;
          await appointment.save();
        }
      } catch (stripeErr) {
        console.warn("Stripe check warning:", stripeErr);
      }
    } else {
      appointment.payment.status = "Paid";
      appointment.status = "Confirmed";
      appointment.payment.paidAt = new Date();
      await appointment.save();
    }

    return res.json({
      success: true,
      message: "Service booking payment confirmed",
      appointment,
    });
  } catch (error) {
    console.error("confirmServicePayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Service Appointments
export const getServiceAppointments = async (req, res) => {
  try {
    const {
      serviceId,
      mobile,
      status,
      date,
      search = "",
      createdBy,
      userId,
      email,
      limit: limitRaw = 100,
      page: pageRaw = 1,
    } = req.query;

    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 100));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (serviceId) filter.serviceId = serviceId;
    if (mobile) filter.mobile = mobile;
    if (status && status !== "All") filter.status = status;
    if (date) filter.date = date;

    const creator = createdBy || userId || (req.user?.id && req.user?.role !== "admin" ? req.user.id : null);
    if (creator && !serviceId) {
      const orConditions = [{ createdBy: creator }, { mobile: creator }];
      if (email) orConditions.push({ email: email.trim().toLowerCase() });
      filter.$or = orConditions;
    } else if (email && !serviceId) {
      filter.email = email.trim().toLowerCase();
    }

    if (search) {
      const re = new RegExp(search.trim(), "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { serviceName: re }];
    }

    const items = await ServiceAppointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("serviceId", "name shortDescription imageUrl price")
      .lean();

    const total = await ServiceAppointment.countDocuments(filter);

    return res.json({
      success: true,
      appointments: items,
      data: items,
      meta: { page, limit, total, count: items.length },
    });
  } catch (err) {
    console.error("getServiceAppointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getServiceAppintmentsByPatient = async (req, res) => {
  return getServiceAppointments(req, res);
};

export const getServiceAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ServiceAppointment.findById(id).populate("serviceId").lean();
    if (!item) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    return res.json({ success: true, data: item, appointment: item });
  } catch (error) {
    console.error("getServiceAppointmentById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateServiceAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const appointment = await ServiceAppointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Service booking not found" });
    }

    const updatable = ["status", "date", "time", "hour", "minute", "ampm", "rescheduledTo", "notes"];
    updatable.forEach((field) => {
      if (body[field] !== undefined) appointment[field] = body[field];
    });

    if (body.paymentStatus) appointment.payment.status = body.paymentStatus;
    if (body.status === "Completed") appointment.payment.status = "Paid";

    await appointment.save();
    return res.json({ success: true, message: "Service booking updated", appointment });
  } catch (error) {
    console.error("updateServiceAppointment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelServiceAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await ServiceAppointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: "Not found" });

    appointment.status = "Canceled";
    await appointment.save();
    return res.json({ success: true, message: "Booking canceled successfully", appointment });
  } catch (error) {
    console.error("cancelServiceAppointment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getServiceAppointmentStats = async (req, res) => {
  try {
    const total = await ServiceAppointment.countDocuments();
    const confirmed = await ServiceAppointment.countDocuments({ status: "Confirmed" });
    const completed = await ServiceAppointment.countDocuments({ status: "Completed" });
    const pending = await ServiceAppointment.countDocuments({ status: "Pending" });
    const canceled = await ServiceAppointment.countDocuments({ status: "Canceled" });

    const paidList = await ServiceAppointment.find({
      $or: [{ "payment.status": "Paid" }, { status: "Completed" }],
    });
    const totalEarnings = paidList.reduce((acc, curr) => acc + (curr.fees || 0), 0);

    return res.json({
      success: true,
      stats: { total, confirmed, completed, pending, canceled, earnings: totalEarnings },
    });
  } catch (error) {
    console.error("getServiceAppointmentStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};