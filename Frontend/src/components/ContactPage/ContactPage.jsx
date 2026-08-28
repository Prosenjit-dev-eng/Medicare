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
  const [submitted, setSubmitted] = useState(false);

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

  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please fill in your Full Name and Phone Number.");
      return;
    }

    const textMessage = `*New Healthcare Inquiry - MediCare*%0A%0A*Name:* ${encodeURIComponent(
      formData.fullName
    )}%0A*Email:* ${encodeURIComponent(formData.email || "N/A")}%0A*Phone:* ${encodeURIComponent(
      formData.phone
    )}%0A*Department:* ${encodeURIComponent(formData.department)}%0A*Service Required:* ${encodeURIComponent(
      formData.service
    )}%0A*Message:* ${encodeURIComponent(formData.message || "I would like more information.")}`;

    const whatsappUrl = `https://wa.me/918299431275?text=${textMessage}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            24/7 Patient Helpdesk & Clinic Information
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in <span className="text-emerald-600">Touch With Us</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Have questions regarding doctor availability, diagnostic test pricing, or clinic appointments? Send us an instant WhatsApp inquiry or visit our central clinic.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: INQUIRY FORM */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                <p className="text-xs text-slate-500">Instant response via WhatsApp support</p>
              </div>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Redirecting to WhatsApp chat with MediCare helpdesk...</span>
              </div>
            )}

            <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    placeholder="Dr. / Mr. / Ms. John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="8299431275"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Required
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Describe your medical requirement or preferred appointment slot..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: CLINIC DETAILS & MAP */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visit Our Clinic Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Visit Our Clinic</h3>
                  <p className="text-xs text-slate-500">MediCare Super Speciality Centre</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Clinic Address</strong>
                    <span>Gomtinagar, Lucknow, Uttar Pradesh, 226010, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Phone Support</strong>
                    <a href="tel:8299431275" className="text-emerald-700 hover:underline">
                      +91 8299431275
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Email Address</strong>
                    <a href="mailto:info@yourclinic.com" className="text-emerald-700 hover:underline">
                      info@yourclinic.com / hexagonsservices@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600 pt-3 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Clinic Hours</strong>
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                    <span className="text-xs text-red-500 block font-semibold">Sunday: Emergency Services Only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Card */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 overflow-hidden">
              <div className="rounded-2xl overflow-hidden h-64 border border-slate-200">
                <iframe
                  title="MediCare Clinic Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113904.75704153926!2d80.93297746193796!3d26.852924195155455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd0a0a555555%3A0x7d0a92ef64d7df6a!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ContactPage;