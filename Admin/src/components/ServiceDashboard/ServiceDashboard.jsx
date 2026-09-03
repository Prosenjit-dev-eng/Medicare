import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Activity,
  PlusSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Clock,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function ServiceDashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 28400,
    totalBookings: 19,
    completed: 14,
    pending: 4,
    totalServices: 8,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServiceData() {
      setLoading(true);
      try {
        const resStats = await fetch(`${API_BASE}/service-appointments/stats/summary`);
        const dataStats = await resStats.json();

        const resBookings = await fetch(`${API_BASE}/service-appointments?limit=6`);
        const dataBookings = await resBookings.json();

        const resServices = await fetch(`${API_BASE}/services?limit=6`);
        const dataServices = await resServices.json();

        if (dataStats.success && dataStats.stats) {
          setStats((prev) => ({
            ...prev,
            totalEarnings: dataStats.stats.earnings || 28400,
            totalBookings: dataStats.stats.total || 19,
            completed: dataStats.stats.completed || 14,
            pending: dataStats.stats.pending || 4,
          }));
        }

        if (dataBookings.success && dataBookings.appointments) {
          setRecentBookings(dataBookings.appointments);
        }

        if (dataServices.success && dataServices.services) {
          setServicesList(dataServices.services);
        }
      } catch (err) {
        console.warn("Using sample service dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServiceData();
  }, []);

  const kpis = [
    {
      title: "Diagnostic Revenue",
      value: `₹${(stats.totalEarnings || 28400).toLocaleString()}`,
      subtitle: "+14.2% from lab tests",
      icon: DollarSign,
      color: "bg-teal-500 text-white",
      bgLight: "bg-teal-50 text-teal-800 border-teal-100",
    },
    {
      title: "Diagnostic Bookings",
      value: stats.totalBookings || 19,
      subtitle: `${stats.completed || 14} Samples processed`,
      icon: Calendar,
      color: "bg-emerald-500 text-white",
      bgLight: "bg-emerald-50 text-emerald-800 border-emerald-100",
    },
    {
      title: "Pending Sample Tests",
      value: stats.pending || 4,
      subtitle: "Awaiting clinic arrival",
      icon: Clock,
      color: "bg-amber-500 text-white",
      bgLight: "bg-amber-50 text-amber-800 border-amber-100",
    },
    {
      title: "Available Lab Tests",
      value: servicesList.length || 8,
      subtitle: "NABL certified packages",
      icon: Grid,
      color: "bg-cyan-500 text-white",
      bgLight: "bg-cyan-50 text-cyan-800 border-cyan-100",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-bold backdrop-blur-xs">
            <Activity className="w-3.5 h-3.5" />
            NABL Pathology & Radiology Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Diagnostic Services Hub
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
            Create diagnostic screening packages, customize patient pre-test preparation instructions, and manage sample processing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/add-service"
            className="px-5 py-3 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <PlusSquare className="w-4 h-4 text-teal-600" />
            <span>Create New Service</span>
          </Link>

          <Link
            to="/service-appointments"
            className="px-5 py-3 rounded-2xl bg-teal-900/60 hover:bg-teal-900 text-white text-xs font-bold border border-teal-400/30 transition-all inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Patient Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white border ${kpi.bgLight} shadow-sm hover:shadow-lg transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${kpi.color} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-xs font-semibold text-teal-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{kpi.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Service Bookings */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Service Bookings</h3>
              <p className="text-xs text-slate-500">Live diagnostics test reservations</p>
            </div>

            <Link
              to="/service-appointments"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider rounded-xl">
                <tr>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Test Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No service bookings recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentBookings.slice(0, 5).map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {b.patientName}
                        <span className="block text-[10px] text-slate-400 font-normal">{b.mobile}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {b.serviceName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {b.date}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        ₹{b.fees || 499}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Diagnostic Services List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Test Packages</h3>
              <p className="text-xs text-slate-500">Live on patient portal</p>
            </div>

            <Link
              to="/list-service"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {servicesList.slice(0, 5).map((srv) => (
              <div
                key={srv._id}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{srv.name}</h4>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{srv.shortDescription}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-slate-900 text-sm block">₹{srv.price || 499}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default ServiceDashboard;
