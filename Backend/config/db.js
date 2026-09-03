import mongoose from "mongoose";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";

export const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;

  if (!mongoUri) {
    const username = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const host = process.env.MONGODB_HOST;
    const database = process.env.MONGODB_DATABASE || "MediCareSite";

    if (!username || !password || !host) {
      throw new Error("Set MONGODB_URL, or set MONGODB_USER, MONGODB_PASSWORD, and MONGODB_HOST in Backend/.env");
    }

    mongoUri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${database}?authSource=admin`;
  } else if (!mongoUri.includes("authSource=")) {
    mongoUri += `${mongoUri.includes("?") ? "&" : "?"}authSource=admin`;
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(mongoUri);
  console.log("MongoDB Database Connected Successfully: MediCareSite");

  // Auto-seed basic data if empty
  await seedInitialDatabaseData();
};

async function seedInitialDatabaseData() {
  try {
    // 1. Seed Super Admin
    const adminExists = await User.findOne({ email: "admin@medicare.com" });
    if (!adminExists) {
      await User.create({
        name: "Super Administrator",
        email: "admin@medicare.com",
        password: "admin123",
        role: "admin",
        phone: "+91 8299431275",
      });
      console.log("Seeded default Super Admin: admin@medicare.com");
    }

    // 2. Seed Default Patient
    const patientExists = await User.findOne({ email: "patient@example.com" });
    if (!patientExists) {
      await User.create({
        name: "John Doe",
        email: "patient@example.com",
        password: "123456",
        role: "patient",
        phone: "9876543210",
        age: 32,
        gender: "Male",
      });
      console.log("Seeded default Patient: patient@example.com");
    }

    // 3. Seed Default Doctors if empty
    const doctorsCount = await Doctor.countDocuments();
    if (doctorsCount === 0) {
      await Doctor.create([
        {
          name: "Dr. Rahul Sharma",
          email: "dr1@gmail.com",
          password: "123456",
          specialization: "Cardiologist",
          experience: "12+ Years",
          qualifications: "MBBS, MD (Cardiology), DM",
          location: "Gomtinagar, Lucknow",
          fee: 600,
          rating: 4.9,
          availability: "Available",
          patients: "5000+",
          success: "98%",
          about: "Senior consultant with over a decade of experience in non-invasive cardiology and coronary interventions.",
          schedule: {
            "2026-09-01": ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
            "2026-09-02": ["02:00 PM", "02:30 PM", "03:00 PM"],
          },
        },
        {
          name: "Dr. Priya Patel",
          email: "dr2@gmail.com",
          password: "123456",
          specialization: "Dermatologist",
          experience: "9+ Years",
          qualifications: "MBBS, MD (DVL)",
          location: "Hazratganj, Lucknow",
          fee: 500,
          rating: 4.8,
          availability: "Available",
          patients: "3800+",
          success: "99%",
          about: "Expert in clinical dermatology, laser procedures, acne treatment, and trichology.",
          schedule: {
            "2026-09-01": ["11:00 AM", "11:30 AM", "12:00 PM"],
            "2026-09-02": ["04:00 PM", "04:30 PM", "05:00 PM"],
          },
        },
        {
          name: "Dr. Ananya Verma",
          email: "dr3@gmail.com",
          password: "123456",
          specialization: "Pediatrician",
          experience: "10+ Years",
          qualifications: "MBBS, DCH, DNB (Pediatrics)",
          location: "Aliganj, Lucknow",
          fee: 550,
          rating: 4.9,
          availability: "Available",
          patients: "4200+",
          success: "97%",
          about: "Compassionate child healthcare specialist focusing on newborn care, developmental assessment, and immunizations.",
          schedule: {
            "2026-09-01": ["09:30 AM", "10:00 AM", "10:30 AM"],
            "2026-09-03": ["03:00 PM", "03:30 PM"],
          },
        },
        {
          name: "Dr. Vikram Malhotra",
          email: "dr4@gmail.com",
          password: "123456",
          specialization: "Orthopedic Surgeon",
          experience: "14+ Years",
          qualifications: "MBBS, MS (Orthopedics)",
          location: "Indira Nagar, Lucknow",
          fee: 700,
          rating: 4.8,
          availability: "Available",
          patients: "6100+",
          success: "96%",
          about: "Specialized in joint replacement, sports injury rehab, and spine management.",
          schedule: {
            "2026-09-02": ["10:00 AM", "10:30 AM", "11:00 AM"],
            "2026-09-03": ["02:00 PM", "02:30 PM"],
          },
        },
      ]);
      console.log("Seeded initial verified Doctors into MongoDB");
    }

    // 4. Seed Default Diagnostic Services if empty
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      await Service.create([
        {
          name: "Diet & Nutrition Counselling",
          shortDescription: "Personalized dietary plans, metabolic analysis & nutritionist consultation.",
          about: "Our certified nutritionists assess your body composition, clinical markers, and daily habits.",
          price: 499,
          available: true,
          instructions: ["Bring recent blood test reports", "List daily dietary intake"],
          slots: {
            "2026-09-01": ["10:00 AM", "11:00 AM", "03:00 PM"],
            "2026-09-02": ["10:00 AM", "04:00 PM"],
          },
        },
        {
          name: "Blood Pressure Check & ECG",
          shortDescription: "Precision digital BP monitoring, 12-lead ECG, and cardiac assessment.",
          about: "Comprehensive cardiovascular screening with immediate physician interpretation of your resting electrocardiogram.",
          price: 349,
          available: true,
          instructions: ["Avoid caffeine 1 hour before test", "Wear loose clothing"],
          slots: {
            "2026-09-01": ["09:00 AM", "10:00 AM", "11:00 AM"],
            "2026-09-02": ["09:00 AM", "12:00 PM"],
          },
        },
        {
          name: "Blood Sugar Test & HbA1c",
          shortDescription: "Fasting blood glucose, postprandial levels, and 3-month average HbA1c screening.",
          about: "Essential screening for pre-diabetes, diabetes management, and insulin sensitivity.",
          price: 299,
          available: true,
          instructions: ["10-12 hours overnight fasting required", "Water intake is permitted"],
          slots: {
            "2026-09-01": ["08:00 AM", "08:30 AM", "09:00 AM"],
            "2026-09-02": ["08:00 AM", "09:00 AM"],
          },
        },
        {
          name: "Full Body Health Checkup",
          shortDescription: "72+ vital parameters including Complete Hemogram, Kidney, Liver, and Lipid profile.",
          about: "Our most comprehensive wellness package ensuring early detection of underlying deficiencies.",
          price: 999,
          available: true,
          instructions: ["10-12 hours fasting mandatory", "Collect morning urine sample in sterile container"],
          slots: {
            "2026-09-01": ["08:00 AM", "09:00 AM", "10:00 AM"],
            "2026-09-02": ["08:00 AM", "09:30 AM"],
          },
        },
      ]);
      console.log("Seeded initial Diagnostic Lab Services into MongoDB");
    }
  } catch (seedErr) {
    console.warn("Initial seeding note:", seedErr.message);
  }
}