import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    qualifications: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    fee: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    schedule: {
      type: Map,
      of: [String],
      default: {},
    },
    success: {
      type: String,
      default: "98%",
    },
    patients: {
      type: String,
      default: "500+",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ name: "text", specialization: "text" });//text search

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;