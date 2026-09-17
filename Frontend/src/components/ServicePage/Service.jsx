import React, { useState, useEffect } from "react";
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
  ShieldAlert,
  FileText,
  Lock,
  Key,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
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
    name: "Blood Pressure Check & ECG Scan",
    shortDescription: "Digital automated blood pressure profiling and 12-lead ECG analysis.",
    about: "Essential cardiovascular baseline assessment combining high-accuracy digital sphygmomanometer readings with computerized 12-lead Electrocardiogram recording.",
    price: 349,
    available: true,
    imageUrl: S2,
    instructions: ["Avoid caffeine 2 hours prior", "Wear loose comfortable clothing"],
    slots: {
      "2026-09-01": ["09:00 AM", "11:30 AM", "02:00 PM"],
      "2026-09-03": ["10:00 AM", "01:00 PM"],
    },
  },
  {
    _id: "srv_3",
    name: "Blood Sugar Test & HbA1c",
    shortDescription: "Fasting blood glucose, postprandial glucose & 3-month HbA1c glycation.",
    about: "Gold standard diabetes management panel evaluating immediate and 90-day glycemic control to assess metabolic health.",
    price: 449,
    available: true,
    imageUrl: S3,
    instructions: ["Fasting 8-10 hours overnight", "Morning water intake permitted"],
    slots: {
      "2026-09-01": ["08:00 AM", "08:30 AM", "09:00 AM"],
      "2026-09-02": ["08:00 AM", "08:30 AM"],
    },
  },
  {
    _id: "srv_4",
    name: "Full Body Health Checkup",
    shortDescription: "Comprehensive 64+ parameter master profile including Liver, Kidney, Lipid & CBC.",
    about: "Our flagship preventive health assessment covering Complete Hemogram, Renal profile, Liver function, Lipid profile, and urine routine.",
    price: 1499,
    available: true,
    imageUrl: S4,
    instructions: ["10-12 hours overnight fasting", "First morning urine sample"],
    slots: {
      "2026-09-01": ["08:00 AM", "09:00 AM", "10:00 AM"],
      "2026-09-03": ["08:00 AM", "09:30 AM"],
    },
  },
  {
    _id: "srv_5",
    name: "Digital Chest X-Ray Scan",
    shortDescription: "High-resolution low-dose digital chest radiograph (PA View) with radiologist review.",
    about: "High-resolution radiograph of the chest cavity, lungs, airways, heart, and chest wall bones with quick electronic delivery.",
    price: 599,
    available: true,
    imageUrl: S5,
    instructions: ["Remove all jewelry/metal items", "Inform radiographer if pregnant"],
    slots: {
      "2026-09-01": ["10:00 AM", "12:00 PM", "04:00 PM"],
      "2026-09-02": ["11:00 AM", "03:00 PM"],
    },
  },
  {
    _id: "srv_6",
    name: "Thyroid Profile (T3, T4, TSH)",
    shortDescription: "Accurate chemiluminescence immunoassay for Total T3, Total T4, and Ultrasensitive TSH.",
    about: "Evaluates thyroid gland activity to diagnose hyperthyroidism, hypothyroidism, and endocrine metabolic imbalances.",
    price: 399,
    available: true,
    imageUrl: S6,
    instructions: ["Early morning sample preferred", "Take thyroid medication after test"],
    slots: {
      "2026-09-01": ["08:30 AM", "09:30 AM", "10:30 AM"],
      "2026-09-02": ["08:30 AM", "10:00 AM"],
    },
  },
  {
    _id: "srv_7",
    name: "Complete Hemogram (CBC)",
    shortDescription: "Automated 24-parameter complete blood count with ESR and platelet indices.",
    about: "Essential screening tool for detecting anemia, infections, platelet count disorders, and systemic hematological conditions.",
    price: 299,
    available: true,
    imageUrl: S7,
    instructions: ["No mandatory fasting required", "Sample collection via venous blood"],
    slots: {
      "2026-09-01": ["09:00 AM", "11:00 AM", "02:00 PM"],
      "2026-09-02": ["09:00 AM", "12:00 PM"],
    },
  },
  {
    _id: "srv_8",
    name: "Lipid Profile & Cholesterol Panel",
    shortDescription: "Total Cholesterol, Triglycerides, HDL, LDL, VLDL, and Cardiac Risk Ratio.",
    about: "Assesses blood fats and lipid fractions to quantify cardiovascular disease risk and guide cholesterol therapy.",
    price: 549,
    available: true,
    imageUrl: S8,
    instructions: ["Strict 12 hours overnight fasting", "Avoid heavy dinner previous night"],
    slots: {
      "2026-09-01": ["08:00 AM", "09:00 AM", "10:00 AM"],
      "2026-09-02": ["08:30 AM", "11:00 AM"],
    },
  },
];

function Service() {
  const { isSignedIn, user, openLogin } = useAuth();
  const [authNotice, setAuthNotice] = useState("");
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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://medicare-backend-93w9.onrender.com/api";

  const fetchServices = (q) => {
    setLoading(true);
    let url = `${API_BASE_URL}/services?limit=20`;
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
    if (isSignedIn && user) {
      let savedProfile = {};
      try {
        if (user.id) {
          savedProfile = JSON.parse(localStorage.getItem(`medicare_user_profile_${user.id}`) || "{}");
        }
      } catch (e) {}

      setPatientName(user.name || savedProfile.patientName || "");
      setPatientEmail(user.email || savedProfile.patientEmail || "");
      setPatientMobile(user.phone ? String(user.phone).replace(/\D/g, "").slice(0, 10) : savedProfile.patientMobile || "");
      if (savedProfile.patientAge) setPatientAge(savedProfile.patientAge);
      if (savedProfile.patientGender) setPatientGender(savedProfile.patientGender);
    }
  }, [isSignedIn, user]);

  const handleOpenBooking = (srv) => {
    if (!isSignedIn) {
      setAuthNotice("Please log in to your MediCare account first to book diagnostic services and proceed with payment.");
      openLogin();
      return;
    }
    setAuthNotice("");
    setSelectedService(srv);
    setBookingSuccess(false);
    setBookingError("");

    let savedProfile = {};
    try {
      if (user?.id) {
        savedProfile = JSON.parse(localStorage.getItem(`medicare_user_profile_${user.id}`) || "{}");
      }
    } catch (e) {}

    setPatientName(user?.name || savedProfile.patientName || "");
    setPatientEmail(user?.email || savedProfile.patientEmail || "");
    setPatientMobile(user?.phone ? String(user?.phone).replace(/\D/g, "").slice(0, 10) : savedProfile.patientMobile || "");
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

    // 1. User must be logged in for payment
    if (!isSignedIn || !user?.id) {
      setBookingError("You must be logged in to proceed with payment and book a diagnostic service.");
      openLogin();
      return;
    }

    if (!patientName.trim()) {
      setBookingError("Please enter the patient's full name.");
      return;
    }

    // 2. Exact 10 digits for mobile number
    const cleanMobile = patientMobile.replace(/\D/g, "");
    if (!cleanMobile) {
      setBookingError("Mobile number is required.");
      return;
    }
    if (cleanMobile.length !== 10) {
      setBookingError("Mobile number must contain exactly 10 digits (e.g. 9876543210).");
      return;
    }

    // 3. Email must contain @
    const emailTrim = patientEmail.trim();
    if (!emailTrim || !emailTrim.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setBookingError("Please enter a valid email address containing '@' (e.g. patient@example.com).");
      return;
    }

    if (!selectedDate) {
      setBookingError("Please select a preferred service date.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch(`${API_BASE_URL}/service-appointments`, {
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
          frontendUrl: window.location.origin,
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
      if (!user?.id) {
        setBookingError("Authentication required. Please sign in to proceed.");
        return;
      }
      try {
        const fallbackSrv = {
          _id: `srv_app_${Date.now()}`,
          serviceId: selectedService._id,
          serviceName: selectedService.name,
          patientName,
          email: patientEmail || user?.email || "",
          mobile: patientMobile,
          createdBy: user.id,
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
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base transition-all"
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
                      className={`px-4 py-2.5 rounded-xl ${
                        isSignedIn
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-emerald-700/90 hover:bg-emerald-700 text-white"
                      } font-bold text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer`}
                    >
                      {isSignedIn ? <Calendar className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isSignedIn ? "Book Now" : "Login to Book"}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* SERVICE BOOKING MODAL */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden my-auto">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Book Diagnostic Service</h3>
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
              <div className="p-5 sm:p-8 overflow-y-auto flex-1">
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
                ) : !isSignedIn ? (
                  <div className="text-center py-10 px-4 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white">Authentication Required</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      You must be logged in to schedule diagnostic tests, complete payment, and book {selectedService.name}.
                    </p>
                    <button
                      type="button"
                      onClick={() => openLogin()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Key className="w-4 h-4" />
                      <span>Log In / Sign Up to Book</span>
                    </button>
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number (Exact 10 Digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={patientMobile}
                          onChange={(e) => setPatientMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {patientMobile.replace(/\D/g, "").length}/10 digits
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address (Must contain '@') *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="patient@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
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

        {/* Floating Auth Notification Toast */}
        {authNotice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-600 text-white shadow-2xl flex items-center gap-3 max-w-md animate-bounce">
            <Lock className="w-5 h-5 shrink-0 text-amber-100" />
            <span className="text-xs sm:text-sm font-semibold">{authNotice}</span>
            <button
              onClick={() => setAuthNotice("")}
              className="ml-auto text-xs uppercase font-bold text-amber-100 hover:text-white underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Service;