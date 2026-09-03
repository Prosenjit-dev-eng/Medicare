import mongoose from "mongoose";

const serviceAppointmentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: null,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    // Service Info
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
    },
    // Schedule info
    date: {
      type: String,
      required: true,
      index: true,
    },
    time: {
      type: String,
      default: "",
    },
    hour: {
      type: Number,
      default: 10,
    },
    minute: {
      type: Number,
      default: 0,
    },
    ampm: {
      type: String,
      enum: ["AM", "PM"],
      default: "AM",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rescheduled", "Completed", "Canceled"],
      default: "Pending",
      index: true,
    },
    rescheduledTo: {
      date: { type: String },
      time: { type: String },
      hour: { type: Number },
      minute: { type: Number },
      ampm: { type: String, enum: ["AM", "PM"] },
    },
    notes: {
      type: String,
      default: "",
    },
    // Payment info
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
      amount: {
        type: Number,
        required: true,
      },
      providerId: {
        type: String,
        default: "",
      },
      paidAt: {
        type: Date,
        default: null,
      },
      sessionId: {
        type: String,
        default: "",
        index: true,
      },
      meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

serviceAppointmentSchema.index({ date: 1, status: 1 });

const ServiceAppointment =
  mongoose.models.ServiceAppointment ||
  mongoose.model("ServiceAppointment", serviceAppointmentSchema);

export default ServiceAppointment;