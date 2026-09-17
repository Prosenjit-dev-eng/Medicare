import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Sparkles,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  Lock,
  Key,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

function ContactPage() {
  const { isSignedIn, user, openLogin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "General Medicine",
    service: "Doctor Consultation",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: "", text: "" });

  // Auto-populate patient details when authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || (user.phone ? String(user.phone).replace(/\D/g, "").slice(0, 10) : ""),
      }));
    }
  }, [isSignedIn, user]);

  const departments = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Neurology",
    "Diagnostic Pathology",
  ];

  const servicesList = [
    "Doctor Consultation",
    "Diet & Nutrition Counselling",
    "Blood Pressure Check & ECG",
    "Blood Sugar Test & HbA1c",
    "Full Body Health Checkup",
    "Digital Chest X-Ray Scan",
    "Thyroid Profile (T3, T4, TSH)",
    "Other Diagnostic Query",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your Full Name.";
    }

    const cleanPhone = (formData.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required.";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Mobile number must contain exactly 10 digits (e.g. 9876543210).";
    }

    const emailTrim = (formData.email || "").trim();
    if (!emailTrim) {
      errs.email = "Email address is required.";
    } else if (!emailTrim.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      errs.email = "Email address must contain '@' and a valid domain (e.g. user@example.com).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 1. WhatsApp Query Action (Guarded by Login)
  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setNotification({
        type: "error",
        text: "Please log in to your MediCare account first to submit a query or contact our medical desk.",
      });
      openLogin();
      return;
    }

    if (!validate()) {
      setNotification({
        type: "error",
        text: "Please provide a valid 10-digit mobile number and an email containing '@' to proceed.",
      });
      setTimeout(() => setNotification({ type: "", text: "" }), 4000);
      return;
    }

    const textMessage = `*New Healthcare Query - MediCare*%0A%0A*Name:* ${encodeURIComponent(
      formData.fullName
    )}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Email:* ${encodeURIComponent(
      formData.email || "N/A"
    )}%0A*Department:* ${encodeURIComponent(formData.department)}%0A*Service:* ${encodeURIComponent(
      formData.service
    )}%0A*Query Message:* ${encodeURIComponent(formData.message || "I would like more information.")}`;

    const whatsappUrl = `https://wa.me/916289644619?text=${textMessage}`;
    window.open(whatsappUrl, "_blank");

    setNotification({
      type: "whatsapp",
      text: "Opening WhatsApp chat with MediCare helpdesk (+91 6289644619)...",
    });
    setTimeout(() => setNotification({ type: "", text: "" }), 4000);
  };

  // 2. Email Query Action (Guarded by Login)
  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setNotification({
        type: "error",
        text: "Please log in to your MediCare account first to submit a query or contact our medical desk.",
      });
      openLogin();
      return;
    }

    if (!validate()) {
      setNotification({
        type: "error",
        text: "Please provide a valid 10-digit mobile number and an email containing '@' to proceed.",
      });
      setTimeout(() => setNotification({ type: "", text: "" }), 4000);
      return;
    }

    const emailSubject = encodeURIComponent(
      `[MediCare Query] ${formData.service} - ${formData.fullName}`
    );

    const emailBody = encodeURIComponent(
      `Hello MediCare Healthcare Team,\n\nI have a medical query regarding your clinical services.\n\nQuery Details:\n- Name: ${formData.fullName}\n- Phone: ${formData.phone || "Not provided"}\n- Email: ${formData.email || "Not provided"}\n- Department: ${formData.department}\n- Service Required: ${formData.service}\n\nQuery Message:\n${formData.message || "Please provide consultation slots and fee details."}\n\nThank you,\n${formData.fullName}`
    );

    const mailtoUrl = `mailto:techprosenjit45@gmail.com?cc=techprosenjit45@gmail.com&subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;

    setNotification({
      type: "email",
      text: "Opening your email client to send inquiry to techprosenjit45@gmail.com...",
    });
    setTimeout(() => setNotification({ type: "", text: "" }), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            24/7 Patient Helpdesk & Query Support
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in <span className="text-emerald-600 dark:text-emerald-400">Touch With Us</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Have questions regarding doctor availability, diagnostic test pricing, or clinic appointments? Submit your query below via WhatsApp or Email.
          </p>
        </div>

        {/* TOP ROW: BALANCED 2-COLUMN GRID (NO EMPTY GAP) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE: QUERY FORM (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-slate-800 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Patient Query</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send your inquiry directly via WhatsApp or Email</p>
                </div>
              </div>

              {/* Authentication Status Banner */}
              {!isSignedIn ? (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                        Login Required to Submit Queries
                      </h4>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300">
                        Please sign in with your MediCare account before sending queries or contacting medical staff.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openLogin()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Sign In to Continue</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Logged in as <strong>{user?.name || "Patient"}</strong> {user?.email ? `(${user.email})` : ""}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    Verified Patient
                  </span>
                </div>
              )}

              {/* Notification Banner */}
              {notification.text && (
                <div
                  className={`mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${
                    notification.type === "whatsapp"
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
                      : notification.type === "email"
                      ? "bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800"
                      : "bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 border-red-300 dark:border-red-800"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{notification.text}</span>
                </div>
              )}

              {/* Form Fields */}
              <form className="space-y-4 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                        errors.fullName ? "border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                      } focus:outline-none focus:ring-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (Exact 10 Digits) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                        errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                      } focus:outline-none focus:ring-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm`}
                    />
                    {errors.phone ? (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">{formData.phone.length}/10 digits</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Must contain '@') *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                    } focus:outline-none focus:ring-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Medical Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Interested Service
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                    >
                      {servicesList.map((srv) => (
                        <option key={srv} value={srv} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Query Details / Symptoms
                  </label>
                  <textarea
                    rows="3"
                    name="message"
                    placeholder="Describe your health question, symptoms, or preferred consultation timing..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                  ></textarea>
                </div>

                {/* DUAL ACTION BUTTONS */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className={`w-full py-3.5 px-4 rounded-2xl ${
                      isSignedIn
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-emerald-700/90 hover:bg-emerald-700 text-white"
                    } active:scale-98 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
                  >
                    {isSignedIn ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{isSignedIn ? "Send via WhatsApp" : "Sign In & Send WhatsApp"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className={`w-full py-3.5 px-4 rounded-2xl ${
                      isSignedIn
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "bg-teal-700/90 hover:bg-teal-700 text-white"
                    } active:scale-98 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
                  >
                    {isSignedIn ? <Mail className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{isSignedIn ? "Send via Email" : "Sign In & Send Email"}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE: CLINIC INFORMATION & EMERGENCY DESK (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-slate-800 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-2xl bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visit Our Clinic</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">MediCare Super Speciality Centre</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-white block">Clinic Address</strong>
                    <span>Barasat, North 24 Parganas, Kolkata, 700124, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-white block">Phone Support</strong>
                    <a href="tel:8299431275" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      +91 6289644619
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-white block">Email Address</strong>
                    <a href="mailto:techprosenjit45@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      techprosenjit45@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-white block">Clinic Hours</strong>
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Alert */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-amber-900 dark:text-amber-200 block">24/7 Emergency Casualty</strong>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">Call +91 8299431275 for instant ambulance assistance.</p>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: FULL-WIDTH CLINIC MAP (NO EMPTY GAP ON LEFT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Clinic Geolocation & Navigation Map</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Central clinic location with ample patient parking and wheelchair accessibility
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-slate-700 self-start sm:self-auto">
              <Navigation className="w-3.5 h-3.5" />
              Interactive GPS View
            </span>
          </div>

          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-800">
            <iframe
              title="MediCare Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d38547.05940030956!2d88.49135945569103!3d22.700593072346695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1787943710809!5m2!1sen!2sin"
              className="w-full h-full block border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;