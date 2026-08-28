import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    owner: { type: String, default: null, index: true },
    createdBy: { type: String, default: null, index: true },
    // Patient info
    patientName: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    mobile: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    // Doctor info
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    doctorName: { type: String, default: "" },
    speciality: { type: String, default: "" },
    doctorImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    fees: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled", "Rescheduled"],
      default: "Pending",
      index: true,
    },
    rescheduledTo: {
      date: { type: String },
      time: { type: String },
    },
    payment: {
      method: {
        type: String,
        enum: ["Cash", "Online"],
        default: "Online",
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      amount: { type: Number, default: 0 },
      providerId: { type: String, default: "" },
      meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    sessionId: { type: String, default: null, index: true },
    paidAt: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;