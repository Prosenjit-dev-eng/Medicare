import express from "express";
import cors from "cors";
import "dotenv/config";
import {clerkMiddleware} from '@clerk/express';

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// Allowed Origins for Frontend (5173) and Admin Portal (5174)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5175",
];

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true); // Allow during development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);
// app.use(cors());
app.use(clerkMiddleware());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Connect Database before accepting requests.
try {
  await connectDB();
} catch (error) {
  console.error("MongoDB Connection Failed:", error.message);
  process.exit(1);
}

// API Routes
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "MediCare - Healthcare Solutions API is running",
    timestamp: new Date().toISOString(),
  });
});
// Routes
app.get('/',(req,res)=>{
  res.send("API WORKING")
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Express global error:", err?.stack || err?.message || err);
  res.status(500).json({
    success: false,
    message: err?.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`MediCare Backend Server started on http://localhost:${port}`);
});
