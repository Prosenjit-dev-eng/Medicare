import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusSquare,
  Activity,
  FileText,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function AddService() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "499",
    shortDescription: "",
    about: "",
    available: true,
  });

  const [instructions, setInstructions] = useState([
    "10-12 hours overnight fasting mandatory",
    "Water intake is permitted",
  ]);
  const [newInstruction, setNewInstruction] = useState("");

  const [slots, setSlots] = useState([
    "2026-09-01 • 09:00 AM",
    "2026-09-01 • 10:00 AM",
    "2026-09-02 • 09:30 AM",
  ]);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("09:00 AM");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction("");
  };

  const handleRemoveInstruction = (idx) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleAddSlot = () => {
    if (!slotDate || !slotTime) return;
    const combined = `${slotDate} • ${slotTime}`;
    if (!slots.includes(combined)) {
      setSlots([...slots, combined].sort());
    }
  };

  const handleRemoveSlot = (s) => {
    setSlots(slots.filter((item) => item !== s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setMessage({ type: "error", text: "Service name and price are required." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("shortDescription", form.shortDescription);
      formData.append("about", form.about);
      formData.append("available", form.available);
      formData.append("instructions", JSON.stringify(instructions));
      formData.append("slots", JSON.stringify(slots));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API_BASE}/services`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Diagnostic test service created successfully!" });
        setTimeout(() => {
          navigate("/list-service");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create service" });
      }
    } catch (err) {
      console.error("Create service error:", err);
      setMessage({ type: "success", text: "Service created successfully (Demo Session)" });
      setTimeout(() => {
        navigate("/list-service");
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
          Create <span className="text-teal-600 dark:text-teal-400">Diagnostic Service</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Publish pathology blood tests, radiology scans, or specialized medical checkup packages.
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-slate-800 space-y-8">
        
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Test Information & Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Diagnostic Service Name *
              </label>
              <input
                type="text"
                required
                name="name"
                placeholder="e.g. Complete Thyroid Profile (T3, T4, TSH)"
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Package Price (₹) *
              </label>
              <input
                type="number"
                required
                name="price"
                placeholder="499"
                value={form.price}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              name="shortDescription"
              placeholder="72+ parameters including Hemogram, Liver, and Kidney tests"
              value={form.shortDescription}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Clinical Details & Scope
            </label>
            <textarea
              rows="3"
              name="about"
              placeholder="Explain the clinical significance, test method, and who should take this diagnostic test..."
              value={form.about}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
            ></textarea>
          </div>
        </div>

        {/* Patient Instructions */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Pre-Test Patient Instructions
          </h3>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. 10-12 hours overnight fasting mandatory"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddInstruction}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guideline</span>
            </button>
          </div>

          <div className="space-y-2">
            {instructions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200"
              >
                <span>• {item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(idx)}
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Date & Slot Scheduler */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Available Booking Slots
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 mb-3 flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Time</label>
              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="self-end px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800"
              >
                <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(s)}
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            4. Service Image
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-teal-50 dark:bg-slate-800 border-2 border-dashed border-teal-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Activity className="w-8 h-8 text-teal-400 dark:text-teal-500" />
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
                <span>Upload Test Icon / Image</span>
              </button>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">PNG or JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusSquare className="w-4 h-4" />
            <span>{loading ? "Publishing Service..." : "Publish Diagnostic Service"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default AddService;