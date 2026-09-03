import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Stethoscope,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  MapPin,
  Award,
  Star,
  RefreshCw,
  X,
  DollarSign,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function ListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/doctors?limit=100`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      console.warn("Using sample doctors list:", err);
      setDoctors([
        {
          _id: "doc_101",
          name: "Dr. Rahul Sharma",
          specialization: "Cardiologist",
          experience: "12+ Years",
          qualifications: "MBBS, MD (Cardiology)",
          location: "Gomtinagar, Lucknow",
          fee: 600,
          rating: 4.9,
          availability: "Available",
          patients: "5000+",
          success: "98%",
          about: "Senior Cardiologist with extensive clinical practice.",
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
          availability: "Available",
          patients: "3800+",
          success: "99%",
          about: "Expert clinical dermatologist and laser specialist.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}/toggle-availability`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("doctorToken_v1") || ""}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors((prev) =>
          prev.map((d) => (d._id === id ? { ...d, availability: data.data?.availability || (currentStatus === "Available" ? "Unavailable" : "Available") } : d))
        );
      }
    } catch (err) {
      setDoctors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, availability: currentStatus === "Available" ? "Unavailable" : "Available" } : d))
      );
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor from the portal?")) return;
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("doctorToken_v1") || ""}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Specialist Doctors <span className="text-emerald-600">Directory</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Manage all active medical specialists, toggle slot availability, and review clinical profiles.
          </p>
        </div>

        <button
          onClick={fetchDoctors}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          <input
            type="text"
            placeholder="Search doctor by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Specialist Doctor</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Qualifications & Experience</th>
                <th className="py-3.5 px-4">Consult Fee</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No doctors matching your query.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold overflow-hidden shrink-0">
                          {doc.imageUrl ? (
                            <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <Stethoscope className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <span className="block">{doc.name}</span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            📍 {doc.location || "Lucknow, UP"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      {doc.specialization}
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div>{doc.qualifications || "MBBS, MD"}</div>
                      <span className="text-[11px] text-slate-400">{doc.experience || "8+ Years"} Experience</span>
                    </td>

                    <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{doc.fee || 500}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(doc._id, doc.availability)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          doc.availability === "Available"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            doc.availability === "Available" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span>{doc.availability || "Available"}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDoctor(doc)}
                          title="View Profile"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteDoctor(doc._id)}
                          title="Remove Doctor"
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCTOR DETAILS MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                  <p className="text-xs text-emerald-100">{selectedDoctor.specialization}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-2 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 block mb-1 text-sm">Qualifications</strong>
                <p>{selectedDoctor.qualifications || "MBBS, MD"}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1 text-sm">Biography & About</strong>
                <p className="leading-relaxed">{selectedDoctor.about || "No biography provided."}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block">Consult Fee</span>
                  <span className="text-base font-extrabold text-slate-900">₹{selectedDoctor.fee || 500}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Experience</span>
                  <span className="text-sm font-bold text-slate-800">{selectedDoctor.experience || "8+ Years"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ListPage;