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
} from "lucide-react";

const API_BASE = "http://localhost:4000";

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
        // Fetch stats
        const resStats = await fetch(`${API_BASE}/api/appointments/stats/summary`);
        const dataStats = await resStats.json();

        // Fetch appointments
        const resApp = await fetch(`${API_BASE}/api/appointments?limit=6`);
        const dataApp = await resApp.json();

        // Fetch doctors
        const resDocs = await fetch(`${API_BASE}/api/doctors?limit=5`);
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

  const statCards = [
    {
      title: role === "admin" ? "Total Revenue" : "Total Earnings",
      value: `₹${(stats.totalEarnings || 45600).toLocaleString()}`,
      subtitle: "+18.4% from last month",
      icon: DollarSign,
      color: "bg-emerald-500 text-white",
      bgLight: "bg-emerald-50 text-emerald-800 border-emerald-100",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments || 24,
      subtitle: `${stats.completed || 18} Completed visits`,
      icon: Calendar,
      color: "bg-teal-500 text-white",
      bgLight: "bg-teal-50 text-teal-800 border-teal-100",
    },
    {
      title: "Pending Confirmations",
      value: stats.pending || 5,
      subtitle: "Requires action",
      icon: Clock,
      color: "bg-amber-500 text-white",
      bgLight: "bg-amber-50 text-amber-800 border-amber-100",
    },
    {
      title: "Active Specialists",
      value: stats.totalDoctors || 6,
      subtitle: "Across 8 specialties",
      icon: Stethoscope,
      color: "bg-cyan-500 text-white",
      bgLight: "bg-cyan-50 text-cyan-800 border-cyan-100",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-bold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            System Live & Operational
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome back, {user.name || (role === "admin" ? "Super Admin" : "Doctor")}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            {role === "admin"
              ? "Access platform-wide hospital operations, add doctors, control diagnostic services, and view appointment earnings."
              : "Review your consultation schedule, track patient requests, update slot availability, and monitor consult earnings."}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/appointments"
            className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Manage Schedule</span>
          </Link>

          {role === "admin" && (
            <Link
              to="/add"
              className="px-5 py-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-bold border border-emerald-400/30 transition-all inline-flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Add Doctor</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white border ${stat.bgLight} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${stat.color} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Appointments & Doctors Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Appointments Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Patient Appointments</h3>
              <p className="text-xs text-slate-500">Live consultation requests from website</p>
            </div>

            <Link
              to="/appointments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
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
                  <th className="py-3 px-3">Doctor</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Fee</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No recent appointments found.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.slice(0, 5).map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {app.patientName}
                        <span className="block text-[10px] text-slate-400 font-normal">{app.mobile}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {app.doctorName || "Doctor"}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="font-semibold">{app.date}</span>
                        <span className="block text-[10px] text-slate-400">{app.time}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        ₹{app.fees || 500}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : app.status === "Canceled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Links & Specialists */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/add"
                className="p-3.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Onboard New Doctor</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </Link>

              <Link
                to="/add-service"
                className="p-3.5 rounded-2xl bg-teal-50/80 hover:bg-teal-100 text-teal-900 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-teal-600" />
                  <span>Add Diagnostic Service</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-teal-600" />
              </Link>

              <Link
                to="/service-appointments"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-slate-600" />
                  <span>Diagnostic Bookings</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>
          </div>

          {/* Featured Doctors Mini List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Top Specialists</h3>
              <Link to="/list" className="text-xs font-bold text-emerald-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {doctorsList.slice(0, 4).map((doc) => (
                <div key={doc._id} className="flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-slate-500 text-[11px]">{doc.specialization}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      doc.availability === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doc.availability || "Available"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
