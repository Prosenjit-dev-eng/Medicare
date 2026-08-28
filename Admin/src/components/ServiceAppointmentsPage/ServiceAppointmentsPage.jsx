import React, { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

function ServiceAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const fetchServiceAppointments = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/service-appointments?limit=100`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter && statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;
      if (dateFilter) url += `&date=${encodeURIComponent(dateFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.warn("Using sample service appointments:", err);
      setAppointments([
        {
          _id: "srv_app_1",
          patientName: "Kavita Rao",
          mobile: "9988776655",
          email: "kavita@example.com",
          serviceName: "Full Body Health Checkup",
          date: "2026-09-02",
          time: "08:30 AM",
          fees: 999,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid", amount: 999 },
        },
        {
          _id: "srv_app_2",
          patientName: "Rohit Verma",
          mobile: "9123456780",
          email: "rohit@example.com",
          serviceName: "Diet & Nutrition Counselling",
          date: "2026-09-03",
          time: "10:00 AM",
          fees: 499,
          status: "Pending",
          payment: { method: "Cash", status: "Pending", amount: 499 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServiceAppointments();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/service-appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Lab <span className="text-teal-600">Test Bookings</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Track patient sample collection schedules, update test completion statuses, and verify payments.
          </p>
        </div>

        <button
          onClick={fetchServiceAppointments}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-300 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-emerald-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
            <input
              type="text"
              placeholder="Search by patient name, mobile, test package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Patient Info</th>
                <th className="py-3.5 px-4">Diagnostic Package</th>
                <th className="py-3.5 px-4">Test Schedule</th>
                <th className="py-3.5 px-4">Fee & Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No diagnostic bookings matching filters.
                  </td>
                </tr>
              ) : (
                appointments.map((srv) => (
                  <tr key={srv._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {srv.patientName}
                      <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                        📞 {srv.mobile} {srv.email ? `• ${srv.email}` : ""}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      <div>{srv.serviceName}</div>
                      <span className="text-[10px] font-semibold text-teal-600">NABL Diagnostic Test</span>
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <div className="font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{srv.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{srv.time || "10:00 AM"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">₹{srv.fees || 499}</div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          srv.payment?.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {srv.payment?.method || "Online"} • {srv.payment?.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          srv.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : srv.status === "Completed"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : srv.status === "Canceled"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {srv.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {srv.status !== "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(srv._id, "Confirmed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors"
                          >
                            Confirm
                          </button>
                        )}

                        {srv.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateStatus(srv._id, "Completed")}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors"
                          >
                            Complete
                          </button>
                        )}

                        {srv.status !== "Canceled" && (
                          <button
                            onClick={() => handleUpdateStatus(srv._id, "Canceled")}
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

export default ServiceAppointmentsPage;