import React, { useState } from "react";
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
} from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "General Medicine",
    service: "Doctor Consultation",
    message: "",
  });

  const [notification, setNotification] = useState({ type: "", text: "" });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. WhatsApp Query Action
  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your Full Name and Phone Number for WhatsApp inquiry.");
      return;
    }

    const textMessage = `*New Healthcare Query - MediCare*%0A%0A*Name:* ${encodeURIComponent(
      formData.fullName
    )}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Email:* ${encodeURIComponent(
      formData.email || "N/A"
    )}%0A*Department:* ${encodeURIComponent(formData.department)}%0A*Service:* ${encodeURIComponent(
      formData.service
    )}%0A*Query Message:* ${encodeURIComponent(formData.message || "I would like more information.")}`;

    const whatsappUrl = `https://wa.me/918299431275?text=${textMessage}`;
    window.open(whatsappUrl, "_blank");

    setNotification({
      type: "whatsapp",
      text: "Opening WhatsApp chat with MediCare helpdesk (+91 8299431275)...",
    });
    setTimeout(() => setNotification({ type: "", text: "" }), 4000);
  };

  // 2. Email Query Action
  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      alert("Please enter your Full Name.");
      return;
    }

    const emailSubject = encodeURIComponent(
      `[MediCare Query] ${formData.service} - ${formData.fullName}`
    );

    const emailBody = encodeURIComponent(
      `Hello MediCare Healthcare Team,\n\nI have a medical query regarding your clinical services.\n\nQuery Details:\n- Name: ${formData.fullName}\n- Phone: ${formData.phone || "Not provided"}\n- Email: ${formData.email || "Not provided"}\n- Department: ${formData.department}\n- Service Required: ${formData.service}\n\nQuery Message:\n${formData.message || "Please provide consultation slots and fee details."}\n\nThank you,\n${formData.fullName}`
    );

    const mailtoUrl = `mailto:techprosenjit45@gmail.com?cc=hexagonsservices@gmail.com&subject=${emailSubject}&body=${emailBody}`;
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

              {/* Notification Banner */}
              {notification.text && (
                <div
                  className={`mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${
                    notification.type === "whatsapp"
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
                      : "bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800"
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
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                  />
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
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send via Email</span>
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