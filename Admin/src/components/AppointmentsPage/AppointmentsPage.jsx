import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  RefreshCw,
  Edit2,
  Stethoscope,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/appointments?limit=100`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter && statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;
      if (dateFilter) url += `&date=${encodeURIComponent(dateFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.warn("Using sample appointments:", err);
      setAppointments([
        {
          _id: "app_101",
          patientName: "Aarav Sharma",
          mobile: "9876543210",
          email: "aarav@example.com",
          doctorName: "Dr. Rahul Sharma",
          speciality: "Cardiologist",
          date: "2026-09-02",
          time: "10:30 AM",
          fees: 600,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid", amount: 600 },
        },
        {
          _id: "app_102",
          patientName: "Neha Gupta",
          mobile: "8765432109",
          email: "neha@example.com",
          doctorName: "Dr. Priya Patel",
          speciality: "Dermatologist",
          date: "2026-09-02",
          time: "11:30 AM",
          fees: 500,
          status: "Pending",
          payment: { method: "Cash", status: "Pending", amount: 500 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error("Update error:", err);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } finally {
      setActionLoading(false);
    }
  };

  const role = localStorage.getItem("medicare_admin_role") || "doctor";
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("medicare_admin_user") || "{}");
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Stethoscope size={12} />
            <span>{role === "doctor" ? "Doctor Consultation Queue" : "Hospital Central Scheduling"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {role === "doctor" ? "My Scheduled Appointments" : "Patient Appointments Manager"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === "doctor"
              ? `Manage your active clinical consultations, update diagnosis status, or reschedule appointments for ${user.name || "Dr. Rahul Sharma"}.`
              : "Monitor all doctor consultations, verify Stripe online transactions, and manage clinic patient flow."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchAppointments}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Appointments"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <input
              type="text"
              placeholder="Search by patient name, phone, doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="lg:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            />
          </div>

        </div>
      </div>

      {/* Appointments List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Patient Information</th>
                <th className="py-3.5 px-4">Doctor & Speciality</th>
                <th className="py-3.5 px-4">Appointment Schedule</th>
                <th className="py-3.5 px-4">Fee & Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No appointments matching your filters.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {app.patientName}
                      <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                        📞 {app.mobile} {app.email ? `• ${app.email}` : ""}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{app.doctorName || "Doctor"}</div>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {app.speciality || "Specialist"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <div className="font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{app.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.time}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">₹{app.fees || 500}</div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.payment?.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.payment?.method || "Online"} • {app.payment?.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : app.status === "Completed"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : app.status === "Canceled"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status !== "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, "Confirmed")}
                            title="Confirm Appointment"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors"
                          >
                            Confirm
                          </button>
                        )}

                        {app.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, "Completed")}
                            title="Mark as Completed"
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors"
                          >
                            Complete
                          </button>
                        )}

                        {app.status !== "Canceled" && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, "Canceled")}
                            title="Cancel Appointment"
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AppointmentsPage;