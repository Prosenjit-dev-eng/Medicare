import express from "express";
import multer from "multer";
import {
  createDoctor,
  deleteDoctor,
  doctorLogin,
  getDoctorById,
  getDoctors,
  toggleAvailiablity,
  updateDoctor,
} from "../controllers/doctorController.js";
import doctorAuth from "../middlewares/doctorAuth.js";
// Option A (Best for Render): Change it to '/tmp'. Linux servers like Render explicitly allow writing to the /tmp directory.
const upload = multer({ dest: "/tmp" });
const doctorRouter = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", upload.single("image"), createDoctor);

// Protected routes (Doctor or Admin)
doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailiablity);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
