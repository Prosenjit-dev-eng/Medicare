import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, ArrowRight, Award, MapPin } from "lucide-react";
import HD1 from "../../assets/HD1.png";
import HD2 from "../../assets/HD2.png";
import HD3 from "../../assets/HD3.png";
import HD4 from "../../assets/HD4.png";

const featuredDoctors = [
  {
    _id: "home_doc_1",
    name: "Dr. Rohit Sharma",
    specialization: "Senior Cardiologist",
    experience: "12+ Years",
    qualifications: "MBBS, MD (Cardiology)",
    location: "Ganganagar, Kolkata",
    fee: 600,
    rating: 4.9,
    imageUrl: HD2,
    availability: "Available",
  },
  {
    _id: "home_doc_2",
    name: "Dr. Papia Patel",
    specialization: "Dermatologist & Cosmetologist",
    experience: "9+ Years",
    qualifications: "MBBS, MD (Dermatology)",
    location: "Hazaribagh, Kolkata",
    fee: 500,
    rating: 4.8,
    imageUrl: HD1,
    availability: "Available",
  },
  {
    _id: "home_doc_3",
    name: "Dr. Shefali Verma",
    specialization: "Pediatrician & Child Specialist",
    experience: "10+ Years",
    qualifications: "MBBS, DCH",
    location: "Aligarh, Kolkata",
    fee: 550,
    rating: 4.9,
    imageUrl: HD3,
    availability: "Available",
  },
  {
    _id: "home_doc_4",
    name: "Dr. Vihan Malhotra",
    specialization: "Orthopedic Surgeon",
    experience: "14+ Years",
    qualifications: "MBBS, MS (Ortho)",
    location: "Mahanagar, Kolkata",
    fee: 700,
    rating: 4.8,
    imageUrl: HD4,
    availability: "Available",
  },
];

function HomeDoctors() {
  const [doctors, setDoctors] = useState(featuredDoctors);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFeaturedDoctors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/doctors?limit=4`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        if (isMounted) {
          const list = data?.doctors || data?.data;
          if (Array.isArray(list) && list.length > 0) {
            setDoctors(list.slice(0, 4));
          } else {
            // Keep rich featured doctors if backend has 0 registered doctors
            setDoctors(featuredDoctors);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Featured doctors fetch failed, retaining fallback:", err);
          if (isMounted) {
            setDoctors(featuredDoctors);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeaturedDoctors();

    // Strict Mode & Cleanup: Only cancel in-flight request and mark unmounted.
    // NEVER call setDoctors([]) in cleanup!
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Run ONCE on mount

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Practitioners
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured <span className="text-emerald-600 dark:text-emerald-400">Medical Specialists</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Book online consultations or in-person visits with board-certified healthcare professionals across all major disciplines.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 hover:gap-3 transition-all duration-200 text-sm sm:text-base self-start md:self-auto"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc, idx) => {
            const imageSrc = doc.imageUrl || featuredDoctors[idx % 4].imageUrl;
            return (
              <div
                key={doc._id || idx}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
              >
                {/* Doctor Image Container */}
                <div className="relative h-60 bg-linear-to-b from-emerald-50 to-teal-50/40 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={imageSrc}
                    alt={doc.name}
                    className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {doc.availability || "Available"}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{doc.rating || 4.8}</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {doc.specialization}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.experience || "8+ Years"} Experience</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location || "Lucknow, India"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">Consult Fee</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{doc.fee || 500}</span>
                    </div>

                    <Link
                      to="/doctors"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HomeDoctors;