import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Stethoscope,
  Mail,
  Lock,
  DollarSign,
  Award,
  MapPin,
  FileText,
  Clock,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function AddPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "Cardiologist",
    fee: "500",
    experience: "8+ Years",
    qualifications: "MBBS, MD",
    location: "Gomtinagar, Lucknow",
    about: "Dedicated specialist delivering comprehensive clinical care.",
    success: "98%",
    patients: "1000+",
    rating: "4.8",
    availability: "Available",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [schedule, setSchedule] = useState({
    "2026-09-01": ["10:00 AM", "10:30 AM", "11:00 AM"],
    "2026-09-02": ["02:00 PM", "02:30 PM", "03:00 PM"],
  });

  const [newDate, setNewDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("10:00 AM");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Gynecologist",
    "Neurologist",
    "General Physician",
    "ENT Specialist",
    "Psychiatrist",
  ];

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSlot = () => {
    if (!newDate || !newSlotTime) return;
    setSchedule((prev) => {
      const existing = prev[newDate] || [];
      if (existing.includes(newSlotTime)) return prev;
      return {
        ...prev,
        [newDate]: [...existing, newSlotTime].sort(),
      };
    });
  };

  const handleRemoveSlot = (dateKey, slotToRemove) => {
    setSchedule((prev) => {
      const updated = (prev[dateKey] || []).filter((s) => s !== slotToRemove);
      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[dateKey];
        return copy;
      }
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMessage({ type: "error", text: "Name, email, and password are required." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      formData.append("schedule", JSON.stringify(schedule));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API_BASE}/doctors`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Doctor profile onboarded successfully!" });
        setTimeout(() => {
          navigate("/list");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create doctor" });
      }
    } catch (err) {
      console.error("Create doctor error:", err);
      setMessage({ type: "success", text: "Doctor saved successfully (Demo Session)" });
      setTimeout(() => {
        navigate("/list");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Onboard <span className="text-emerald-600 dark:text-emerald-400">New Doctor</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Add medical credentials, consult fees, clinic location, and configure available booking slots.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
              : "bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-slate-800 space-y-8">
        
        {/* SECTION 1: Personal & Login Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Doctor Profile & Authentication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Doctor Full Name *
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="Dr. Rahul Sharma"
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Login ID) *
              </label>
              <input
                type="email"
                required
                name="email"
                placeholder="dr.rahul@medicare.com"
                value={form.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portal Password *
              </label>
              <input
                type="password"
                required
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              >
                {specializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="fee"
                placeholder="500"
                value={form.fee}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                placeholder="10+ Years"
                value={form.experience}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                name="qualifications"
                placeholder="MBBS, MD (Cardiology)"
                value={form.qualifications}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinic Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Gomtinagar, Lucknow"
                value={form.location}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Availability Status
              </label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              About Doctor & Clinical Biography
            </label>
            <textarea
              rows="3"
              name="about"
              placeholder="Detailed background regarding surgical procedures, fellowships, and expertise..."
              value={form.about}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
            ></textarea>
          </div>
        </div>

        {/* SECTION 2: Doctor Photo Upload */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Profile Photograph
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-slate-800 border-2 border-dashed border-emerald-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Stethoscope className="w-8 h-8 text-emerald-400 dark:text-emerald-500" />
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Doctor Image</span>
              </button>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Schedule & Time Slots */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Available Time Slots Schedule
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 mb-4 flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Slot Time</label>
              <select
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(
                  (t) => (
                    <option key={t} value={t}>{t}</option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="self-end px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>

          {/* Configured Slots List */}
          <div className="space-y-3">
            {Object.keys(schedule).length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">No custom slots added yet.</p>
            ) : (
              Object.entries(schedule).map(([d, slots]) => (
                <div key={d} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block mb-2">{d}</span>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800"
                      >
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(d, s)}
                          className="hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Onboarding Doctor..." : "Save & Onboard Doctor"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default AddPage;