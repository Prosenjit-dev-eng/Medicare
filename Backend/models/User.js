import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
      index: true,
    },
    phone: {
      type: String,
      default: "",
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
    avatar: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text", email: "text" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
