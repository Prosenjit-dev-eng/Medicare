import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, ArrowRight, Award, MapPin, CheckCircle2 } from "lucide-react";
import HD1 from "../../assets/HD1.png";
import HD2 from "../../assets/HD2.png";
import HD3 from "../../assets/HD3.png";
import HD4 from "../../assets/HD4.png";

const fallbackFeaturedDoctors = [
  {
    _id: "doc_1",
    name: "Dr. Rahul Sharma",
    specialization: "Senior Cardiologist",
    experience: "12+ Years",
    qualifications: "MBBS, MD (Cardiology)",
    location: "Gomtinagar, Lucknow",
    fee: 600,
    rating: 4.9,
    imageUrl: HD1,
    availability: "Available",
  },
  {
    _id: "doc_2",
    name: "Dr. Priya Patel",
    specialization: "Dermatologist & Cosmetologist",
    experience: "9+ Years",
    qualifications: "MBBS, MD (Dermatology)",
    location: "Hazratganj, Lucknow",
    fee: 500,
    rating: 4.8,
    imageUrl: HD2,
    availability: "Available",
  },
  {
    _id: "doc_3",
    name: "Dr. Ananya Verma",
    specialization: "Pediatrician & Child Specialist",
    experience: "10+ Years",
    qualifications: "MBBS, DCH",
    location: "Aliganj, Lucknow",
    fee: 550,
    rating: 4.9,
    imageUrl: HD3,
    availability: "Available",
  },
  {
    _id: "doc_4",
    name: "Dr. Vikram Malhotra",
    specialization: "Orthopedic Surgeon",
    experience: "14+ Years",
    qualifications: "MBBS, MS (Ortho)",
    location: "Indira Nagar, Lucknow",
    fee: 700,
    rating: 4.8,
    imageUrl: HD4,
    availability: "Available",
  },
];

function HomeDoctors() {
  const [doctors, setDoctors] = useState(fallbackFeaturedDoctors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/doctors?limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors);
        }
      })
      .catch((err) => {
        console.warn("Using fallback featured doctors:", err?.message || err);
      });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Verified Practitioners
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="text-emerald-600">Medical Specialists</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Book online consultations or in-person visits with board-certified healthcare professionals across all major disciplines.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 hover:gap-3 transition-all duration-200 text-sm sm:text-base self-start md:self-auto"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc, idx) => {
            const imageSrc = doc.imageUrl || fallbackFeaturedDoctors[idx % 4].imageUrl;
            return (
              <div
                key={doc._id || idx}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
              >
                {/* Doctor Image Container */}
                <div className="relative h-60 bg-gradient-to-b from-emerald-50 to-teal-50/40 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={imageSrc}
                    alt={doc.name}
                    className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {doc.availability || "Available"}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 border border-slate-200 flex items-center gap-1 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{doc.rating || 4.8}</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm font-medium text-emerald-600 mt-0.5">
                      {doc.specialization}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
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
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">Consult Fee</span>
                      <span className="text-base font-extrabold text-slate-900">₹{doc.fee || 500}</span>
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