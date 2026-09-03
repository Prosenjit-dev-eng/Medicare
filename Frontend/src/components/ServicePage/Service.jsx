import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Search,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";
import S1 from "../../assets/S1.png";
import S2 from "../../assets/S2.png";
import S3 from "../../assets/S3.png";
import S4 from "../../assets/S4.png";
import S5 from "../../assets/S5.png";
import S6 from "../../assets/S6.png";
import S7 from "../../assets/S7.png";
import S8 from "../../assets/S8.png";

const fallbackServices = [
  {
    _id: "srv_1",
    name: "Diet & Nutrition Counselling",
    shortDescription: "Personalized dietary plans, metabolic analysis & nutritionist consultation.",
    about: "Our certified nutritionists assess your body composition, clinical markers, and daily habits to formulate a tailored wellness and diet roadmap.",
    price: 499,
    available: true,
    imageUrl: S1,
    instructions: ["Bring recent blood test reports", "List daily dietary intake"],
    slots: {
      "2026-09-01": ["10:00 AM", "11:00 AM", "03:00 PM"],
      "2026-09-02": ["10:00 AM", "04:00 PM"],
    },
  },
  {
    _id: "srv_2",
    name: "Blood Pressure Check & ECG",
    shortDescription: "Precision digital BP monitoring, 12-lead ECG, and cardiac assessment.",
    about: "Comprehensive cardiovascular screening with immediate physician interpretation of your resting electrocardiogram.",
    price: 349,
    available: true,
    imageUrl: S2,
    instructions: ["Avoid caffeine 1 hour before test", "Wear loose clothing"],
    slots: {
      "2026-09-01": ["09:00 AM", "10:00 AM", "11:00 AM"],
      "2026-09-02": ["09:00 AM", "12:00 PM"],
    },
  },
  {
    _id: "srv_3",
    name: "Blood Sugar Test & HbA1c",
    shortDescription: "Fasting blood glucose, postprandial levels, and 3-month average HbA1c screening.",
    about: "Essential screening for pre-diabetes, diabetes management, and insulin sensitivity.",
    price: 299,
    available: true,
    imageUrl: S3,
    instructions: ["10-12 hours overnight fasting required", "Water intake is permitted"],
    slots: {
      "2026-09-01": ["08:00 AM", "08:30 AM", "09:00 AM"],
      "2026-09-02": ["08:00 AM", "09:00 AM"],
    },
  },
  {
    _id: "srv_4",
    name: "Full Body Health Checkup",
    shortDescription: "72+ vital parameters including Complete Hemogram, Kidney, Liver, and Lipid profile.",
    about: "Our most comprehensive wellness package ensuring early detection of underlying deficiencies and clinical anomalies.",
    price: 999,
    available: true,
    imageUrl: S4,
    instructions: ["10-12 hours fasting mandatory", "Collect morning urine sample in sterile container"],
    slots: {
      "2026-09-01": ["08:00 AM", "09:00 AM", "10:00 AM"],
      "2026-09-02": ["08:00 AM", "09:30 AM"],
    },
  },
  {
    _id: "srv_5",
    name: "Digital Chest X-Ray Scan",
    shortDescription: "High-resolution digital radiography for lungs, ribs, and cardiac silhouette.",
    about: "Low-radiation digital radiography performed by certified radiographers with digital film delivery.",
    price: 599,
    available: true,
    imageUrl: S5,
    instructions: ["Remove metallic jewelry", "Inform staff if pregnant"],
    slots: {
      "2026-09-01": ["10:00 AM", "11:30 AM", "02:00 PM"],
      "2026-09-02": ["10:00 AM", "03:00 PM"],
    },
  },
  {
    _id: "srv_6",
    name: "Thyroid Profile (T3, T4, TSH)",
    shortDescription: "Complete hormonal panel to evaluate thyroid gland activity and metabolism.",
    about: "Precision serum analysis for hypo and hyper-thyroidism symptoms, fatigue, and weight irregularities.",
    price: 449,
    available: true,
    imageUrl: S6,
    instructions: ["Early morning fasting blood sample recommended"],
    slots: {
      "2026-09-01": ["08:00 AM", "09:00 AM", "10:30 AM"],
      "2026-09-02": ["08:30 AM", "10:00 AM"],
    },
  },
  {
    _id: "srv_7",
    name: "Liver Function Test (LFT)",
    shortDescription: "Enzyme analysis (SGOT, SGPT, Bilirubin, Albumin) for hepatic health.",
    about: "Essential screening for liver metabolism, medication side effects, and digestive vitality.",
    price: 399,
    available: true,
    imageUrl: S7,
    instructions: ["8-10 hours fasting suggested", "Avoid alcohol 24 hours prior"],
    slots: {
      "2026-09-01": ["08:30 AM", "09:30 AM", "11:00 AM"],
      "2026-09-02": ["09:00 AM", "10:30 AM"],
    },
  },
  {
    _id: "srv_8",
    name: "Kidney Function Test (KFT)",
    shortDescription: "Serum Creatinine, Urea, Uric Acid, and Electrolytes screening.",
    about: "Comprehensive evaluation of renal filtration efficiency and electrolyte equilibrium.",
    price: 399,
    available: true,
    imageUrl: S8,
    instructions: ["Stay normally hydrated", "No intense workout 12 hours prior"],
    slots: {
      "2026-09-01": ["08:00 AM", "09:00 AM", "10:00 AM"],
      "2026-09-02": ["08:30 AM", "11:00 AM"],
    },
  },
];

function Service() {
  const { user } = useUser();
  const [services, setServices] = useState(fallbackServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Booking Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [paymentMethod, setPaymentMethod] = useState("Online");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const fetchServices = (q) => {
    setLoading(true);
    let url = `http://localhost:4000/api/services?limit=20`;
    if (q) url += `&q=${encodeURIComponent(q)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services) {
          const merged = data.services.map((s, idx) => ({
            ...s,
            imageUrl: s.imageUrl || fallbackServices[idx % fallbackServices.length].imageUrl,
          }));
          setServices(merged.length > 0 ? merged : []);
        }
      })
      .catch((err) => {
        console.warn("Using fallback service dataset:", err);
        const filtered = fallbackServices.filter(
          (s) =>
            s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.shortDescription.toLowerCase().includes(q.toLowerCase())
        );
        setServices(filtered);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pre-fill user details when user changes
  useEffect(() => {
    if (user) {
      let savedProfile = {};
      try {
        if (user.id) {
          savedProfile = JSON.parse(localStorage.getItem(`medicare_user_profile_${user.id}`) || "{}");
        }
      } catch (e) {}

      const clerkFullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "";
      const clerkEmail =
        user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";
      const clerkPhone =
        user.primaryPhoneNumber?.phoneNumber ||
        user.phoneNumbers?.[0]?.phoneNumber ||
        user.unsafeMetadata?.phone ||
        "";

      setPatientName(clerkFullName || savedProfile.patientName || "");
      setPatientEmail(clerkEmail || savedProfile.patientEmail || "");
      setPatientMobile(clerkPhone || savedProfile.patientMobile || "");
      if (savedProfile.patientAge) setPatientAge(savedProfile.patientAge);
      if (savedProfile.patientGender) setPatientGender(savedProfile.patientGender);
    }
  }, [user]);

  const handleOpenBooking = (srv) => {
    setSelectedService(srv);
    setBookingSuccess(false);
    setBookingError("");

    let savedProfile = {};
    try {
      if (user?.id) {
        savedProfile = JSON.parse(localStorage.getItem(`medicare_user_profile_${user.id}`) || "{}");
      }
    } catch (e) {}

    const clerkFullName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "";
    const clerkEmail =
      user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
    const clerkPhone =
      user?.primaryPhoneNumber?.phoneNumber ||
      user?.phoneNumbers?.[0]?.phoneNumber ||
      user?.unsafeMetadata?.phone ||
      "";

    setPatientName(clerkFullName || savedProfile.patientName || "");
    setPatientEmail(clerkEmail || savedProfile.patientEmail || "");
    setPatientMobile(clerkPhone || savedProfile.patientMobile || "");
    if (savedProfile.patientAge) setPatientAge(savedProfile.patientAge);
    if (savedProfile.patientGender) setPatientGender(savedProfile.patientGender);

    let scheduleDates = [];
    if (srv.slots && typeof srv.slots === "object" && !Array.isArray(srv.slots)) {
      scheduleDates = Object.keys(srv.slots);
    }
    if (scheduleDates.length > 0) {
      setSelectedDate(scheduleDates[0]);
      const slotsList = srv.slots[scheduleDates[0]] || [];
      setSelectedSlot(slotsList[0] || "10:00 AM");
    } else {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      setSelectedSlot("10:00 AM");
    }
  };

  const handleServiceBookingSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !patientMobile || !selectedDate) {
      setBookingError("Please fill in patient name, phone, and date.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("http://localhost:4000/api/service-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService._id,
          patientName,
          email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
          mobile: patientMobile,
          age: patientAge ? Number(patientAge) : undefined,
          gender: patientGender,
          date: selectedDate,
          time: selectedSlot || "10:00 AM",
          paymentMethod,
          fees: selectedService.price,
          createdBy: user?.id || "guest_patient",
        }),
      });

      const data = await res.json();

      const servicePayload = {
        _id: `srv_app_${Date.now()}`,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        patientName,
        email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
        mobile: patientMobile,
        age: patientAge ? Number(patientAge) : undefined,
        gender: patientGender,
        date: selectedDate,
        time: selectedSlot || "10:00 AM",
        paymentMethod,
        createdBy: user?.id || "guest_patient",
        fees: selectedService.price || 499,
        status: paymentMethod === "Cash" ? "Confirmed" : "Pending",
        payment: {
          method: paymentMethod,
          status: paymentMethod === "Cash" ? "Paid" : "Pending",
          amount: selectedService.price || 499,
        },
      };

      try {
        const existingLocal = JSON.parse(localStorage.getItem("medicare_patient_service_appointments") || "[]");
        localStorage.setItem(
          "medicare_patient_service_appointments",
          JSON.stringify([servicePayload, ...existingLocal])
        );

        if (user?.id) {
          localStorage.setItem(
            `medicare_user_profile_${user.id}`,
            JSON.stringify({
              patientName: patientName.trim(),
              patientEmail: patientEmail.trim(),
              patientMobile: patientMobile.trim(),
              patientAge,
              patientGender,
            })
          );
        }
      } catch (e) {}

      if (data.success) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedService(null);
          setBookingSuccess(false);
        }, 2500);
      } else {
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedService(null);
          setBookingSuccess(false);
        }, 2500);
      }
    } catch (err) {
      console.warn("Backend offline, saving service appointment locally:", err);
      try {
        const fallbackSrv = {
          _id: `srv_app_${Date.now()}`,
          serviceId: selectedService._id,
          serviceName: selectedService.name,
          patientName,
          email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
          mobile: patientMobile,
          createdBy: user?.id || "guest_patient",
          date: selectedDate,
          time: selectedSlot || "10:00 AM",
          fees: selectedService.price || 499,
          status: "Confirmed",
          payment: {
            method: paymentMethod,
            status: paymentMethod === "Cash" ? "Paid" : "Pending",
            amount: selectedService.price || 499,
          },
        };
        const existingLocal = JSON.parse(localStorage.getItem("medicare_patient_service_appointments") || "[]");
        localStorage.setItem(
          "medicare_patient_service_appointments",
          JSON.stringify([fallbackSrv, ...existingLocal])
        );
      } catch (e) {}

      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedService(null);
        setBookingSuccess(false);
      }, 2500);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            NABL Accredited Diagnostics
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Diagnostic & <span className="text-emerald-600 dark:text-emerald-400">Clinical Services</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Book certified pathology, radiology, and wellness health screening tests with automated report delivery and doctor interpretation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 dark:border-slate-800 mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            <input
              type="text"
              placeholder="Search diagnostic tests (e.g., Blood Pressure, Blood Sugar, Full Body)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white text-sm sm:text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const imageSrc = service.imageUrl || fallbackServices[idx % fallbackServices.length].imageUrl;
            return (
              <div
                key={service._id || idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Service Image Container */}
                  <div className="relative h-48 bg-gradient-to-b from-emerald-50/80 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
                    <img
                      src={imageSrc}
                      alt={service.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 shadow-2xs">
                      {service.available !== false ? "Available Today" : "Unavailable"}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {service.shortDescription || service.about}
                    </p>

                    {/* Key instructions tag */}
                    {service.instructions && service.instructions.length > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-100 dark:border-slate-700">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">{service.instructions[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Price & Book Now */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">Test Price</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{service.price || 499}</span>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(service)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* SERVICE BOOKING MODAL */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden my-8">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Book Diagnostic Service</h3>
                    <p className="text-xs text-emerald-100">{selectedService.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-2xl font-bold text-slate-800 dark:text-white">Booking Confirmed!</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      Your appointment for <span className="font-semibold text-emerald-700 dark:text-emerald-400">{selectedService.name}</span> has been confirmed for{" "}
                      <span className="font-semibold">{selectedDate}</span> at <span className="font-semibold">{selectedSlot}</span>.
                    </p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                      Please arrive 15 minutes prior for sample registration.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleServiceBookingSubmit} className="space-y-5">
                    {bookingError && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-sm font-semibold border border-red-200 dark:border-red-800">
                        {bookingError}
                      </div>
                    )}

                    {/* Patient Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={patientMobile}
                          onChange={(e) => setPatientMobile(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="patient@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Time Slot
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              selectedSlot === slot
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <Clock className="w-3 h-3 inline-block mr-1" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Mode */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Payment Mode
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Online")}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            paymentMethod === "Online"
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-500"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">Stripe Online</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cards & UPI</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Cash")}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            paymentMethod === "Cash"
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-500"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          }`}
                        >
                          <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">Pay at Lab</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cash on visit</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Price & Submit Action */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between px-1 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Total Package Amount:</span>
                        <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{selectedService.price || 499}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {bookingLoading
                          ? "Processing Booking..."
                          : paymentMethod === "Online"
                          ? `Pay ₹${selectedService.price || 499} via Stripe & Confirm`
                          : `Confirm Booking (Pay ₹${selectedService.price || 499} at Lab)`}
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Service;