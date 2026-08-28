import React, { useState, useEffect } from "react";
import {
  Grid,
  Search,
  Activity,
  Trash2,
  Eye,
  RefreshCw,
  X,
  FileText,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

function ListServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/services?limit=100`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.warn("Using sample services list:", err);
      setServices([
        {
          _id: "srv_1",
          name: "Diet & Nutrition Counselling",
          price: 499,
          shortDescription: "Personalized dietary plans, metabolic analysis & consultation.",
          about: "Complete nutritional assessment.",
          instructions: ["Bring previous blood reports"],
          available: true,
        },
        {
          _id: "srv_2",
          name: "Blood Pressure Check & ECG",
          price: 349,
          shortDescription: "Precision BP monitoring, 12-lead ECG.",
          about: "Cardiovascular health screening.",
          instructions: ["Avoid caffeine 1 hr prior"],
          available: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diagnostic service?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/services/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      setServices((prev) => prev.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Test <span className="text-teal-600">Packages Directory</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Review all live lab tests, edit pricing, verify pre-test preparation instructions, and manage packages.
          </p>
        </div>

        <button
          onClick={fetchServices}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-300 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
          <input
            type="text"
            placeholder="Search diagnostic test by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Diagnostic Service</th>
                <th className="py-3.5 px-4">Summary Description</th>
                <th className="py-3.5 px-4">Instructions Count</th>
                <th className="py-3.5 px-4">Test Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No diagnostic services matching your search.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold overflow-hidden shrink-0">
                          {srv.imageUrl ? (
                            <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                          ) : (
                            <Activity className="w-5 h-5 text-teal-600" />
                          )}
                        </div>
                        <div>
                          <span className="block">{srv.name}</span>
                          <span className="text-[11px] text-teal-600 font-medium">NABL Diagnostic</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">{srv.shortDescription || srv.about || "Clinical diagnostic package"}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{srv.instructions?.length || 0} guidelines</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{srv.price || 499}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Available</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedService(srv)}
                          title="View Test Details"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteService(srv._id)}
                          title="Remove Test"
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

      {/* DETAILS MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedService.name}</h3>
                  <p className="text-xs text-teal-100">Package Price: ₹{selectedService.price}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 block mb-1 text-sm">Scope & Description</strong>
                <p className="leading-relaxed">{selectedService.about || selectedService.shortDescription}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1 text-sm">Patient Preparation Guidelines</strong>
                <ul className="space-y-1 pl-3 list-disc">
                  {(selectedService.instructions || ["No special preparation required"]).map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ListServicePage;