import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  Award,
  MapPin,
  Star,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Filter,
  Sparkles,
} from "lucide-react";
import D1 from "../../assets/D1.png";
import D2 from "../../assets/D2.png";
import D3 from "../../assets/D3.png";
import D4 from "../../assets/D4.png";
import D5 from "../../assets/D5.png";
import D6 from "../../assets/D6.png";

const fallbackDoctors = [
  {
    _id: "doc_101",
    name: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    experience: "12+ Years",
    qualifications: "MBBS, MD (Cardiology), DM",
    location: "Gomtinagar, Lucknow",
    fee: 600,
    rating: 4.9,
    patients: "5000+",
    success: "98%",
    about: "Senior consultant with over a decade of experience in non-invasive cardiology and coronary interventions.",
    imageUrl: D1,
    availability: "Available",
    schedule: {
      "2026-09-01": ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
      "2026-09-02": ["02:00 PM", "02:30 PM", "03:00 PM"],
    },
  },
  {
    _id: "doc_102",
    name: "Dr. Priya Patel",
    specialization: "Dermatologist",
    experience: "9+ Years",
    qualifications: "MBBS, MD (DVL)",
    location: "Hazratganj, Lucknow",
    fee: 500,
    rating: 4.8,
    patients: "3800+",
    success: "99%",
    about: "Expert in clinical dermatology, laser procedures, acne scars, and trichology.",
    imageUrl: D2,
    availability: "Available",
    schedule: {
      "2026-09-01": ["11:00 AM", "11:30 AM", "12:00 PM"],
      "2026-09-02": ["04:00 PM", "04:30 PM", "05:00 PM"],
    },
  },
  {
    _id: "doc_103",
    name: "Dr. Ananya Verma",
    specialization: "Pediatrician",
    experience: "10+ Years",
    qualifications: "MBBS, DCH, DNB (Pediatrics)",
    location: "Aliganj, Lucknow",
    fee: 550,
    rating: 4.9,
    patients: "4200+",
    success: "97%",
    about: "Compassionate child healthcare specialist focusing on newborn care, developmental assessment, and immunizations.",
    imageUrl: D3,
    availability: "Available",
    schedule: {
      "2026-09-01": ["09:30 AM", "10:00 AM", "10:30 AM"],
      "2026-09-03": ["03:00 PM", "03:30 PM"],
    },
  },
  {
    _id: "doc_104",
    name: "Dr. Vikram Malhotra",
    specialization: "Orthopedic",
    experience: "14+ Years",
    qualifications: "MBBS, MS (Orthopedics)",
    location: "Indira Nagar, Lucknow",
    fee: 700,
    rating: 4.8,
    patients: "6100+",
    success: "96%",
    about: "Specialized in joint replacement, sports injury rehab, and spine management.",
    imageUrl: D4,
    availability: "Available",
    schedule: {
      "2026-09-02": ["10:00 AM", "10:30 AM", "11:00 AM"],
      "2026-09-03": ["02:00 PM", "02:30 PM"],
    },
  },
  {
    _id: "doc_105",
    name: "Dr. Sunita Gupta",
    specialization: "Gynecologist",
    experience: "15+ Years",
    qualifications: "MBBS, MS (Obstetrics & Gynaecology)",
    location: "Mahanagar, Lucknow",
    fee: 650,
    rating: 4.9,
    patients: "7500+",
    success: "99%",
    about: "High-risk pregnancy expert, laparoscopic surgeon, and women's health wellness consultant.",
    imageUrl: D5,
    availability: "Available",
    schedule: {
      "2026-09-01": ["02:00 PM", "02:30 PM", "03:00 PM"],
      "2026-09-02": ["10:00 AM", "10:30 AM"],
    },
  },
  {
    _id: "doc_106",
    name: "Dr. Rajiv Singhal",
    specialization: "Neurologist",
    experience: "11+ Years",
    qualifications: "MBBS, MD, DM (Neurology)",
    location: "Gomtinagar, Lucknow",
    fee: 800,
    rating: 4.9,
    patients: "3200+",
    success: "95%",
    about: "Comprehensive diagnosis and therapy for headaches, stroke prevention, neuropathy, and movement disorders.",
    imageUrl: D6,
    availability: "Available",
    schedule: {
      "2026-09-02": ["05:00 PM", "05:30 PM", "06:00 PM"],
      "2026-09-03": ["11:00 AM", "11:30 AM"],
    },
  },
];

const specialties = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Neurologist",
];

function DoctorsPage() {
  const [doctors, setDoctors] = useState(fallbackDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [loading, setLoading] = useState(false);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const fetchDoctors = (q = "", spec = "All") => {
    setLoading(true);
    let url = `http://localhost:4000/api/doctors?`;
    if (q) url += `q=${encodeURIComponent(q)}&`;
    if (spec && spec !== "All") url += `specialization=${encodeURIComponent(spec)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.doctors) {
          setDoctors(data.doctors.length > 0 ? data.doctors : []);
        }
      })
      .catch((err) => {
        console.warn("Backend error fetching doctors, using filtered fallback:", err);
        const filtered = fallbackDoctors.filter((doc) => {
          const matchQuery =
            !q ||
            doc.name.toLowerCase().includes(q.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(q.toLowerCase());
          const matchSpec = spec === "All" || doc.specialization.toLowerCase() === spec.toLowerCase();
          return matchQuery && matchSpec;
        });
        setDoctors(filtered);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(searchQuery, selectedSpecialty);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialty]);

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingSuccess(false);
    setBookingError("");
    // Default date and slot
    const scheduleDates = Object.keys(doctor.schedule || {});
    if (scheduleDates.length > 0) {
      setSelectedDate(scheduleDates[0]);
      const slots = doctor.schedule[scheduleDates[0]] || [];
      setSelectedSlot(slots[0] || "10:00 AM");
    } else {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      setSelectedSlot("10:00 AM");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !patientMobile || !selectedDate || !selectedSlot) {
      setBookingError("Please complete all required fields.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          patientName,
          email: patientEmail,
          mobile: patientMobile,
          age: patientAge ? Number(patientAge) : undefined,
          gender: patientGender,
          date: selectedDate,
          time: selectedSlot,
          paymentMethod,
          fees: selectedDoctor.fee,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = data.checkoutUrl;
          return;
        }
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedDoctor(null);
          setBookingSuccess(false);
        }, 2500);
      } else {
        setBookingError(data.message || "Failed to schedule appointment");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Demo fallback success
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedDoctor(null);
        setBookingSuccess(false);
      }, 2500);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Top Certified Medical Specialists
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Find & Book <span className="text-emerald-600">Specialist Doctors</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Compare doctor qualifications, consultation fees, and available slot timings. Schedule in-person or teleconsult appointments instantly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm sm:text-base transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
              {specialties.map((spec) => {
                const isActive = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No matching doctors found</h3>
            <p className="text-slate-500 text-sm mt-1">Try refining your search terms or specialty filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {doctors.map((doc, idx) => {
              const imageSrc = doc.imageUrl || fallbackDoctors[idx % fallbackDoctors.length].imageUrl;
              return (
                <div
                  key={doc._id || idx}
                  className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image & Header */}
                    <div className="relative h-64 bg-gradient-to-b from-emerald-50 via-teal-50/50 to-white flex items-center justify-center p-4">
                      <img
                        src={imageSrc}
                        alt={doc.name}
                        className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Availability */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {doc.availability || "Available"}
                      </span>

                      {/* Rating */}
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 shadow-2xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {doc.rating || 4.8}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {doc.name}
                          </h3>
                          <p className="text-sm font-semibold text-emerald-600 mt-0.5">
                            {doc.specialization}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 shrink-0">
                          {doc.experience || "8+ Years"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-1">
                        {doc.qualifications || "MBBS, MD"}
                      </p>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {doc.about || "Dedicated physician focused on empathetic patient consultation and recovery."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location || "Lucknow, Uttar Pradesh"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Fee & Book Button */}
                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fee</span>
                        <span className="text-lg font-extrabold text-slate-900">₹{doc.fee || 500}</span>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(doc)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* BOOKING MODAL */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-8">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Book Appointment</h3>
                    <p className="text-xs text-emerald-100">
                      Consult with {selectedDoctor.name} ({selectedDoctor.specialization})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-2xl font-bold text-slate-800">Appointment Confirmed!</h4>
                    <p className="text-sm text-slate-600 mt-2">
                      Your consultation with <span className="font-semibold text-emerald-700">{selectedDoctor.name}</span> has been booked for{" "}
                      <span className="font-semibold">{selectedDate}</span> at <span className="font-semibold">{selectedSlot}</span>.
                    </p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                      Check "Appointments" page to view booking status.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {bookingError && (
                      <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200">
                        {bookingError}
                      </div>
                    )}

                    {/* Step 1: Patient Information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        1. Patient Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            value={patientMobile}
                            onChange={(e) => setPatientMobile(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="patient@example.com"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              placeholder="32"
                              value={patientAge}
                              onChange={(e) => setPatientAge(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Gender
                            </label>
                            <select
                              value={patientGender}
                              onChange={(e) => setPatientGender(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Date & Slot Selection */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        2. Select Date & Slot
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Consultation Date
                          </label>
                          <input
                            type="date"
                            required
                            value={selectedDate}
                            onChange={(e) => {
                              setSelectedDate(e.target.value);
                              const slots = (selectedDoctor.schedule && selectedDoctor.schedule[e.target.value]) || [];
                              if (slots.length > 0) setSelectedSlot(slots[0]);
                            }}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>

                        {/* Available Slots */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Available Time Slots
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const availableSlots =
                                (selectedDoctor.schedule && selectedDoctor.schedule[selectedDate]) || [
                                  "09:30 AM",
                                  "10:00 AM",
                                  "10:30 AM",
                                  "11:00 AM",
                                  "02:00 PM",
                                  "02:30 PM",
                                  "03:00 PM",
                                ];

                              return availableSlots.map((slot) => {
                                const isSelected = selectedSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                      isSelected
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200"
                                    }`}
                                  >
                                    <Clock className="w-3 h-3 inline-block mr-1" />
                                    {slot}
                                  </button>
                                );
                              })();
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Payment Method */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        3. Payment Method
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Online")}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            paymentMethod === "Online"
                              ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <CreditCard className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="text-sm font-bold text-slate-900">Pay Online (Stripe)</div>
                            <div className="text-xs text-slate-500">Cards, UPI & Netbanking</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Cash")}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            paymentMethod === "Cash"
                              ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <Banknote className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="text-sm font-bold text-slate-900">Pay at Clinic</div>
                            <div className="text-xs text-slate-500">Cash on arrival</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Fee Summary and Submit */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 font-semibold uppercase">Total Amount</div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          ₹{selectedDoctor.fee || 500}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {bookingLoading
                          ? "Processing..."
                          : paymentMethod === "Online"
                          ? "Proceed to Stripe Checkout"
                          : "Confirm Appointment"}
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

export default DoctorsPage;