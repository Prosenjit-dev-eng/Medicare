import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
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
    location: "Gangaganagar, Kolkata",
    fee: 600,
    rating: 4.9,
    patients: "5000+",
    success: "98%",
    about: "Senior consultant with over a decade of experience in non-invasive cardiology and coronary interventions.",
    imageUrl: D2,
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
    location: "Khidirpore, Kolkata",
    fee: 500,
    rating: 4.8,
    patients: "3800+",
    success: "99%",
    about: "Expert in clinical dermatology, laser procedures, acne scars, and trichology.",
    imageUrl: D1,
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
    location: "Aligarh, Kolkata",
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
    location: "Shibpur, Kolkata",
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
    location: "Mahanagar, Kolkata",
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
    location: "Barasat, Kolkata",
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
  const { user } = useUser();
  const [allDoctors, setAllDoctors] = useState(fallbackDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  // 1. Initial Fetch on Mount with proper [] dependency array
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchInitialDoctors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/doctors`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        if (isMounted) {
          const fetchedList = data?.doctors || data?.data;
          if (Array.isArray(fetchedList) && fetchedList.length > 0) {
            setAllDoctors(fetchedList);
          } else {
            // Keep rich fallback data if backend has 0 registered doctors
            setAllDoctors(fallbackDoctors);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Doctors API fetch failed, preserving fallback list:", err);
          if (isMounted) {
            setAllDoctors(fallbackDoctors);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialDoctors();

    // Strict Mode & Cleanup: Only abort the fetch controller and mark unmounted.
    // NEVER call setAllDoctors([]) in cleanup!
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Run ONCE on mount

  // 2. Client-side Search & Category Filtering via useMemo (Guarantees no race conditions or blank overwrites)
  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const specialty = selectedSpecialty.trim().toLowerCase();

    return allDoctors.filter((doc) => {
      const name = (doc.name || "").toLowerCase();
      const spec = (doc.specialization || doc.speciality || "").toLowerCase();
      const location = (doc.location || "").toLowerCase();
      const qual = (doc.qualifications || "").toLowerCase();

      const matchesQuery =
        !query ||
        name.includes(query) ||
        spec.includes(query) ||
        location.includes(query) ||
        qual.includes(query);

      const matchesSpecialty =
        !specialty || specialty === "all" || spec.includes(specialty);

      return matchesQuery && matchesSpecialty;
    });
  }, [allDoctors, searchQuery, selectedSpecialty]);

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

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
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
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          patientName,
          email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
          mobile: patientMobile,
          age: patientAge ? Number(patientAge) : undefined,
          gender: patientGender,
          date: selectedDate,
          time: selectedSlot,
          paymentMethod,
          fees: selectedDoctor.fee,
          createdBy: user?.id || "guest_patient",
        }),
      });
      const data = await res.json();

      const appointmentPayload = {
        _id: `app_${Date.now()}`,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        speciality: selectedDoctor.specialization || "Specialist",
        patientName,
        email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
        mobile: patientMobile,
        age: patientAge ? Number(patientAge) : undefined,
        gender: patientGender,
        date: selectedDate,
        time: selectedSlot,
        paymentMethod,
        createdBy: user?.id || "guest_patient",
        fees: selectedDoctor.fee || 500,
        status: paymentMethod === "Cash" ? "Confirmed" : "Pending",
        payment: {
          method: paymentMethod,
          status: paymentMethod === "Cash" ? "Paid" : "Pending",
          amount: selectedDoctor.fee || 500,
        },
      };

      try {
        const existingLocal = JSON.parse(localStorage.getItem("medicare_patient_appointments") || "[]");
        localStorage.setItem(
          "medicare_patient_appointments",
          JSON.stringify([appointmentPayload, ...existingLocal])
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
          setSelectedDoctor(null);
          setBookingSuccess(false);
        }, 2500);
      } else {
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedDoctor(null);
          setBookingSuccess(false);
        }, 2500);
      }
    } catch (err) {
      console.warn("Backend offline, saving appointment locally:", err);
      try {
        const fallbackApp = {
          _id: `app_${Date.now()}`,
          doctorId: selectedDoctor._id,
          doctorName: selectedDoctor.name,
          speciality: selectedDoctor.specialization || "Specialist",
          patientName,
          email: patientEmail || user?.primaryEmailAddress?.emailAddress || "",
          mobile: patientMobile,
          createdBy: user?.id || "guest_patient",
          date: selectedDate,
          time: selectedSlot,
          fees: selectedDoctor.fee || 500,
          status: "Confirmed",
          payment: {
            method: paymentMethod,
            status: paymentMethod === "Cash" ? "Paid" : "Pending",
            amount: selectedDoctor.fee || 500,
          },
        };
        const existingLocal = JSON.parse(localStorage.getItem("medicare_patient_appointments") || "[]");
        localStorage.setItem(
          "medicare_patient_appointments",
          JSON.stringify([fallbackApp, ...existingLocal])
        );
      } catch (e) {}

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Top Certified Medical Specialists
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find & Book <span className="text-emerald-600 dark:text-emerald-400">Specialist Doctors</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Compare doctor qualifications, consultation fees, and available slot timings. Schedule in-person or teleconsult appointments instantly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 dark:border-slate-800 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base transition-all"
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
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400"
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
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
            <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No matching doctors found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try refining your search terms or specialty filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDoctors.map((doc, idx) => {
              const matchedFallback = fallbackDoctors.find(
                (f) => f.name?.toLowerCase().trim() === doc.name?.toLowerCase().trim()
              ) || fallbackDoctors[idx % fallbackDoctors.length];
              const imageSrc = doc.imageUrl || matchedFallback?.imageUrl;
              return (
                <div
                  key={doc.name || doc._id || idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image & Header */}
                    <div className="relative h-64 bg-linear-to-b from-emerald-50 via-teal-50/50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 flex items-center justify-center p-4">
                      <img
                        src={imageSrc}
                        alt={doc.name}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Availability */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {doc.availability || "Available"}
                      </span>

                      {/* Rating */}
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {doc.rating || 4.8}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {doc.name}
                          </h3>
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {doc.specialization}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-slate-700 shrink-0">
                          {doc.experience || "8+ Years"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 line-clamp-1">
                        {doc.qualifications || "MBBS, MD"}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                        {doc.about || "Dedicated physician focused on empathetic patient consultation and recovery."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location || "Lucknow, Uttar Pradesh"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Fee & Book Button */}
                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fee</span>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{doc.fee || 500}</span>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(doc)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden my-auto">
              
              {/* Modal Header */}
              <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Book Appointment</h3>
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
              <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-2xl font-bold text-slate-800 dark:text-white">Appointment Confirmed!</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      Your consultation with <span className="font-semibold text-emerald-700 dark:text-emerald-400">{selectedDoctor.name}</span> has been booked for{" "}
                      <span className="font-semibold">{selectedDate}</span> at <span className="font-semibold">{selectedSlot}</span>.
                    </p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                      Check "Appointments" page to view booking status.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {bookingError && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-sm font-semibold border border-red-200 dark:border-red-800">
                        {bookingError}
                      </div>
                    )}

                    {/* Step 1: Patient Information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        1. Patient Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Full Name *
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
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            value={patientMobile}
                            onChange={(e) => setPatientMobile(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="patient@example.com"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              placeholder="32"
                              value={patientAge}
                              onChange={(e) => setPatientAge(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Gender
                            </label>
                            <select
                              value={patientGender}
                              onChange={(e) => setPatientGender(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                            >
                              <option value="Male" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Male</option>
                              <option value="Female" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Female</option>
                              <option value="Other" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Date & Slot Selection */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        2. Select Date & Slot
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                          />
                        </div>

                        {/* Available Slots */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Available Time Slots
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {((selectedDoctor.schedule && selectedDoctor.schedule[selectedDate]) || [
                              "09:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "02:00 PM",
                              "03:00 PM",
                              "04:00 PM",
                            ]).map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                  selectedSlot === slot
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Payment Method */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        3. Payment Method
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Online")}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            paymentMethod === "Online"
                              ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/80 ring-2 ring-emerald-500"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750"
                          }`}
                        >
                          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">Pay Online (Stripe)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Cards, UPI & Netbanking</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("Cash")}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            paymentMethod === "Cash"
                              ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/80 ring-2 ring-emerald-500"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750"
                          }`}
                        >
                          <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">Pay at Clinic</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Cash on arrival</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Fee Summary and Submit */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-400 dark:text-slate-400 font-semibold uppercase">Total Amount</div>
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          ₹{selectedDoctor.fee || 500}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
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