import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const stripeInstance = STRIPE_KEY ? new Stripe(STRIPE_KEY) : null;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  return "http://localhost:5173";
};

// Create a Doctor Appointment
export const createAnApointment = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      doctorId,
      patientName,
      email = "",
      mobile,
      age,
      gender = "",
      date,
      time,
      notes = "",
      paymentMethod = "Online",
      fees,
      createdBy,
    } = body;

    if (!doctorId || !patientName || !mobile || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, patient name, mobile, date, and time are required.",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const consultationFee = Number(fees) || Number(doctor.fee) || 500;
    const userId = createdBy || req.user?.id || req.auth?.userId || "guest_patient";

    const newAppointment = new Appointment({
      owner: doctor._id.toString(),
      createdBy: userId,
      patientName: patientName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      age: Number(age) || null,
      gender,
      doctorId: doctor._id,
      doctorName: doctor.name,
      speciality: doctor.specialization || doctor.speciality || "General",
      doctorImage: {
        url: doctor.imageUrl || "",
        publicId: doctor.imagePublicId || "",
      },
      date,
      time,
      fees: consultationFee,
      notes,
      status: paymentMethod === "Cash" ? "Confirmed" : "Pending",
      payment: {
        method: paymentMethod,
        status: paymentMethod === "Cash" ? "Paid" : "Pending",
        amount: consultationFee,
      },
    });

    // If Online Payment with Stripe
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
                name: `Doctor Consultation: ${doctor.name}`,
                description: `Appointment on ${date} at ${time} with ${doctor.specialization || "Doctor"}`,
                images: doctor.imageUrl ? [doctor.imageUrl] : [],
              },
              unit_amount: Math.round(consultationFee * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${frontendBase}/appointments?session_id={CHECKOUT_SESSION_ID}&appointment_id=${newAppointment._id}&status=success`,
        cancel_url: `${frontendBase}/appointments?status=cancelled`,
        metadata: {
          appointmentId: newAppointment._id.toString(),
          doctorId: doctor._id.toString(),
          patientName,
          type: "doctor_appointment",
        },
      });

      newAppointment.sessionId = session.id;
      newAppointment.payment.sessionId = session.id;
      await newAppointment.save();

      return res.status(201).json({
        success: true,
        message: "Appointment created, redirecting to payment",
        appointment: newAppointment,
        sessionId: session.id,
        checkoutUrl: session.url,
        url: session.url,
      });
    }

    await newAppointment.save();
    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("createAnApointment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Get Appointments (Filters: doctorId, createdBy/patientId, status, date, search)
export const getAppointments = async (req, res) => {
  try {
    const {
      doctorId,
      mobile,
      status,
      search = "",
      date,
      limit: limitRaw = 100,
      page: pageRaw = 1,
      patientClerkId,
      createdBy,
      userId,
    } = req.query;

    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 100));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (mobile) filter.mobile = mobile;
    if (status && status !== "All") filter.status = status;
    if (date) filter.date = date;

    const creator = createdBy || patientClerkId || userId || (req.user?.id && req.user?.role !== "admin" ? req.user.id : null);
    if (creator && !doctorId) {
      filter.$or = [{ createdBy: creator }, { mobile: creator }];
    }

    if (search) {
      const re = new RegExp(search.trim(), "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { doctorName: re }, { speciality: re }];
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("doctorId", "name specialization imageUrl fee location")
      .lean();

    const total = await Appointment.countDocuments(filter);

    return res.json({
      success: true,
      appointments,
      data: appointments,
      meta: { page, limit, total, count: appointments.length },
    });
  } catch (err) {
    console.error("getAppointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Confirm Stripe Payment
export const confirmPayment = async (req, res) => {
  try {
    const { session_id, appointment_id } = req.query;
    const sessionId = session_id || req.body?.sessionId;
    const appointmentId = appointment_id || req.body?.appointmentId;

    let appointment = null;
    if (appointmentId) {
      appointment = await Appointment.findById(appointmentId);
    } else if (sessionId) {
      appointment = await Appointment.findOne({ sessionId });
    }

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (stripeInstance && sessionId) {
      try {
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          appointment.payment.status = "Paid";
          appointment.status = "Confirmed";
          appointment.paidAt = new Date();
          appointment.payment.providerId = session.payment_intent || session.id;
          await appointment.save();
        }
      } catch (stripeErr) {
        console.warn("Stripe verification error:", stripeErr?.message || stripeErr);
      }
    } else {
      appointment.payment.status = "Paid";
      appointment.status = "Confirmed";
      appointment.paidAt = new Date();
      await appointment.save();
    }

    return res.json({
      success: true,
      message: "Payment confirmed successfully",
      appointment,
    });
  } catch (error) {
    console.error("confirmPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Appointment Status (Confirm, Complete, Cancel, Reschedule)
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const updatable = ["status", "date", "time", "rescheduledTo", "notes"];
    updatable.forEach((field) => {
      if (body[field] !== undefined) appointment[field] = body[field];
    });

    if (body.paymentStatus) {
      appointment.payment.status = body.paymentStatus;
    }

    if (body.status === "Completed") {
      appointment.payment.status = "Paid";
    }

    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("updateAppointment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Stats Summary for Doctor / Admin Dashboard
export const getStats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const match = {};
    if (doctorId) match.doctorId = doctorId;

    const total = await Appointment.countDocuments(match);
    const confirmed = await Appointment.countDocuments({ ...match, status: "Confirmed" });
    const completed = await Appointment.countDocuments({ ...match, status: "Completed" });
    const pending = await Appointment.countDocuments({ ...match, status: "Pending" });
    const canceled = await Appointment.countDocuments({ ...match, status: "Canceled" });

    // Calculate total earnings
    const paidAppointments = await Appointment.find({
      ...match,
      $or: [{ "payment.status": "Paid" }, { status: "Completed" }],
    });
    const totalEarnings = paidAppointments.reduce((acc, curr) => acc + (curr.fees || 0), 0);

    return res.json({
      success: true,
      stats: {
        total,
        confirmed,
        completed,
        pending,
        canceled,
        earnings: totalEarnings,
      },
    });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Registered Patients Count
export const getRegisteredUserCount = async (req, res) => {
  try {
    const distinctPatients = await Appointment.distinct("mobile");
    return res.json({
      success: true,
      count: distinctPatients.length || 0,
      total: distinctPatients.length || 0,
    });
  } catch (error) {
    console.error("getRegisteredUserCount error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
