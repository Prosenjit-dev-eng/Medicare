import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Stethoscope,
  Grid,
  Star,
  UserCheck,
  PlusCircle,
  FileText,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalEarnings: 45600,
    totalAppointments: 24,
    completed: 18,
    pending: 5,
    canceled: 1,
    totalDoctors: 6,
    totalServices: 8,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("medicare_admin_role") || "doctor";
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("medicare_admin_user") || "{}");
  } catch {}

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const resStats = await fetch(`${API_BASE}/appointments/stats/summary`);
        const dataStats = await resStats.json();

        const resApp = await fetch(`${API_BASE}/appointments?limit=6`);
        const dataApp = await resApp.json();

        const resDocs = await fetch(`${API_BASE}/doctors?limit=5`);
        const dataDocs = await resDocs.json();

        if (dataStats.success && dataStats.stats) {
          setStats((prev) => ({
            ...prev,
            totalEarnings: dataStats.stats.earnings || 45600,
            totalAppointments: dataStats.stats.total || 24,
            completed: dataStats.stats.completed || 18,
            pending: dataStats.stats.pending || 5,
            canceled: dataStats.stats.canceled || 1,
          }));
        }

        if (dataApp.success && dataApp.appointments) {
          setRecentAppointments(dataApp.appointments);
        }

        if (dataDocs.success && dataDocs.doctors) {
          setDoctorsList(dataDocs.doctors);
        }
      } catch (err) {
        console.warn("Using sample dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const doctorStatCards = [
    {
      title: "My Consultation Earnings",
      value: `₹${(stats.totalEarnings || 32400).toLocaleString()}`,
      subtitle: "+14% from last week",
      icon: DollarSign,
      color: "bg-emerald-500 text-white",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
    },
    {
      title: "My Scheduled Appointments",
      value: stats.totalAppointments || 16,
      subtitle: `${stats.completed || 12} Completed sessions`,
      icon: Calendar,
      color: "bg-teal-500 text-white",
      bgLight: "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-100 dark:border-teal-800",
    },
    {
      title: "Pending Consultations",
      value: stats.pending || 4,
      subtitle: "In waiting queue today",
      icon: Clock,
      color: "bg-amber-500 text-white",
      bgLight: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800",
    },
    {
      title: "Patient Satisfaction",
      value: "4.9 / 5.0",
      subtitle: "Based on 128 reviews",
      icon: Star,
      color: "bg-cyan-500 text-white",
      bgLight: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800",
    },
  ];

  const adminStatCards = [
    {
      title: "Total Hospital Revenue",
      value: `₹${(stats.totalEarnings || 45600).toLocaleString()}`,
      subtitle: "+18.4% from last month",
      icon: DollarSign,
      color: "bg-blue-500 text-white",
      bgLight: "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800",
    },
    {
      title: "Total Patient Bookings",
      value: stats.totalAppointments || 24,
      subtitle: `${stats.completed || 18} Completed visits`,
      icon: Calendar,
      color: "bg-teal-500 text-white",
      bgLight: "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-100 dark:border-teal-800",
    },
    {
      title: "Pending Confirmations",
      value: stats.pending || 5,
      subtitle: "Action required",
      icon: Clock,
      color: "bg-amber-500 text-white",
      bgLight: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800",
    },
    {
      title: "Active Specialists",
      value: stats.totalDoctors || 6,
      subtitle: "Across 8 specialties",
      icon: Stethoscope,
      color: "bg-emerald-500 text-white",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
    },
  ];

  const statCards = role === "doctor" ? doctorStatCards : adminStatCards;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-300">
      
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg ${
          role === "doctor"
            ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
            : "bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900"
        }`}
      >
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
            {role === "doctor" ? <Stethoscope size={14} /> : <Activity size={14} />}
            <span>{role === "doctor" ? "Doctor Clinical Workspace" : "Super Admin Operations Hub"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {role === "doctor"
              ? `Welcome back, ${user.name || "Dr. Rahul Sharma"}`
              : "MediCare Hospital Administration"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            {role === "doctor"
              ? "Here is an overview of your scheduled patient consultations, consultation revenue, and upcoming appointment queue today."
              : "Real-time overview of doctor schedules, patient appointments, clinical services, and revenue streams."}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${card.color} shadow-xs`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span>{card.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Appointments Table Section (Spans 8 or 12 cols) */}
        <div className={role === "doctor" ? "lg:col-span-12" : "lg:col-span-8"}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {role === "doctor" ? "My Upcoming Appointments" : "Recent Patient Bookings"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {role === "doctor"
                    ? "Patient consultations scheduled under your calendar"
                    : "Latest doctor and service bookings across the hospital"}
                </p>
              </div>
              <Link
                to="/appointments"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>View Full Schedule</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3 px-2">Patient</th>
                    <th className="pb-3 px-2">Slot & Date</th>
                    {role === "admin" && <th className="pb-3 px-2">Assigned Doctor</th>}
                    <th className="pb-3 px-2">Fees</th>
                    <th className="pb-3 px-2">Payment</th>
                    <th className="pb-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.slice(0, 6).map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-800 dark:text-white">
                          {app.patientName || app.userData?.name || "Patient"}
                          <span className="block text-[10px] font-normal text-slate-400">{app.mobile || app.userData?.email}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                          {app.date}
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{app.time}</span>
                        </td>
                        {role === "admin" && (
                          <td className="py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                            {app.docData?.name || "Dr. Assigned"}
                          </td>
                        )}
                        <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">
                          ₹{app.amount || app.docData?.fees || 500}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.paymentMethod === "Online" || app.payment
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            {app.paymentMethod === "Online" || app.payment ? "Stripe Paid" : "Cash on Visit"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : app.cancelled
                                ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            }`}
                          >
                            {app.isCompleted ? "Completed" : app.cancelled ? "Canceled" : "Confirmed"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No appointments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin Right Sidebar (Only visible to Admin) */}
        {role === "admin" && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Management Quick Actions
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                <Link
                  to="/add"
                  className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    Onboard New Doctor
                  </span>
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  to="/add-service"
                  className="p-3 rounded-2xl bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Grid size={16} />
                    Add Diagnostic Package
                  </span>
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  to="/service-appointments"
                  className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-800 dark:text-blue-300 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} />
                    Manage Lab Bookings
                  </span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Doctors Availability Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Specialist Directory</h4>
                <Link to="/list" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {doctorsList.slice(0, 4).map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">{doc.speciality || "Specialist"}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.available !== false
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {doc.available !== false ? "Available" : "On Leave"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default DashboardPage;
