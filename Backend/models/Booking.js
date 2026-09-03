import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: ["doctor", "service"],
      required: true,
      default: "doctor",
      index: true,
    },
    // User / Patient info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
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
      trim: true,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    // Doctor reference (if bookingType === 'doctor')
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
      index: true,
    },
    doctorName: {
      type: String,
      default: "",
    },
    doctorSpecialization: {
      type: String,
      default: "",
    },
    // Service reference (if bookingType === 'service')
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
      index: true,
    },
    serviceName: {
      type: String,
      default: "",
    },
    // Schedule details
    date: {
      type: String,
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
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
    notes: {
      type: String,
      default: "",
    },
    // Payment details
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
        default: 0,
      },
      sessionId: {
        type: String,
        default: "",
        index: true,
      },
      providerId: {
        type: String,
        default: "",
      },
      paidAt: {
        type: Date,
        default: null,
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

bookingSchema.index({ date: 1, status: 1 });
bookingSchema.index({ bookingType: 1, status: 1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
