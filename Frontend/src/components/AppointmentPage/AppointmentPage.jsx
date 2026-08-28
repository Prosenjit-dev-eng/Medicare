import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  RefreshCw,
  ArrowRight,
  Phone,
} from "lucide-react";

function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("doctor"); // "doctor" | "service"
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [serviceAppointments, setServiceAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentNotice, setPaymentNotice] = useState(null);

  // Check for Stripe Checkout return redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const appointmentId = searchParams.get("appointment_id");
    const serviceAppointmentId = searchParams.get("service_appointment_id");
    const status = searchParams.get("status");

    if (sessionId && status === "success") {
      if (appointmentId) {
        fetch(`http://localhost:4000/api/appointments/confirm?session_id=${sessionId}&appointment_id=${appointmentId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setPaymentNotice("Your doctor consultation payment was verified successfully!");
              fetchAppointments();
            }
          })
          .catch((e) => console.warn(e));
      } else if (serviceAppointmentId) {
        fetch(
          `http://localhost:4000/api/service-appointments/confirm?session_id=${sessionId}&service_appointment_id=${serviceAppointmentId}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setPaymentNotice("Your diagnostic service payment was verified successfully!");
              fetchAppointments();
            }
          })
          .catch((e) => console.warn(e));
      }
    }
  }, [searchParams]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch Doctor Appointments
      const resDoc = await fetch("http://localhost:4000/api/appointments");
      const dataDoc = await resDoc.json();
      if (dataDoc.success && dataDoc.appointments) {
        setDoctorAppointments(dataDoc.appointments);
      }

      // Fetch Service Appointments
      const resSrv = await fetch("http://localhost:4000/api/service-appointments");
      const dataSrv = await resSrv.json();
      if (dataSrv.success && dataSrv.appointments) {
        setServiceAppointments(dataSrv.appointments);
      }
    } catch (err) {
      console.warn("Using sample dashboard appointments:", err);
      // Demo fallback if backend is offline
      setDoctorAppointments([
        {
          _id: "demo_app_1",
          doctorName: "Dr. Rahul Sharma",
          speciality: "Cardiologist",
          patientName: "John Doe",
          mobile: "9876543210",
          date: "2026-09-02",
          time: "10:30 AM",
          fees: 600,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid", amount: 600 },
        },
      ]);
      setServiceAppointments([
        {
          _id: "demo_srv_1",
          serviceName: "Blood Sugar Test & HbA1c",
          patientName: "John Doe",
          mobile: "9876543210",
          date: "2026-09-03",
          time: "08:30 AM",
          fees: 299,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid", amount: 299 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Completed
          </span>
        );
      case "Canceled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  const getPaymentBadge = (payment = {}) => {
    const isPaid = payment.status === "Paid";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          isPaid
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-amber-100 text-amber-800 border border-amber-200"
        }`}
      >
        {payment.method === "Online" ? (
          <CreditCard className="w-3 h-3 text-current" />
        ) : (
          <Banknote className="w-3 h-3 text-current" />
        )}
        {isPaid ? "Paid Online" : "Pay at Clinic"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Payment confirmation alert */}
        {paymentNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">{paymentNotice}</span>
            </div>
            <button onClick={() => setPaymentNotice(null)} className="text-xs font-bold uppercase text-emerald-800 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Patient <span className="text-emerald-600">Appointments Dashboard</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Review your scheduled doctor consultations, diagnostic lab services, and track payment receipts.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab Switcher: Doctor Appointments vs Booked Services */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("doctor")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "doctor"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Your Doctor Appointments ({doctorAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("service")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "service"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Your Booked Services ({serviceAppointments.length})</span>
          </button>
        </div>

        {/* SECTION 1: DOCTOR APPOINTMENTS */}
        {activeTab === "doctor" && (
          <div>
            {doctorAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No doctor appointments found</h3>
                <p className="text-slate-500 text-sm mt-1">You haven't scheduled any doctor consultations yet.</p>
                <Link
                  to="/doctors"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs"
                >
                  <span>Find a Doctor</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctorAppointments.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between mb-4">
                        {getStatusBadge(app.status)}
                        {getPaymentBadge(app.payment)}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{app.doctorName || "Doctor Consultation"}</h4>
                          <p className="text-xs font-semibold text-emerald-600">{app.speciality || "Specialist"}</p>
                        </div>
                      </div>

                      {/* Schedule Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{app.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{app.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Patient: <strong className="text-slate-800">{app.patientName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Fee */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Fee Paid</span>
                        <span className="text-base font-extrabold text-slate-900">₹{app.fees || 500}</span>
                      </div>
                      <a
                        href="tel:+918299431275"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Clinic Help</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: BOOKED SERVICES */}
        {activeTab === "service" && (
          <div>
            {serviceAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No diagnostic services booked</h3>
                <p className="text-slate-500 text-sm mt-1">You haven't booked any lab tests or diagnostic scans yet.</p>
                <Link
                  to="/services"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs"
                >
                  <span>Explore Diagnostic Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceAppointments.map((srv) => (
                  <div
                    key={srv._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between mb-4">
                        {getStatusBadge(srv.status)}
                        {getPaymentBadge(srv.payment)}
                      </div>

                      {/* Service Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{srv.serviceName || "Diagnostic Test"}</h4>
                          <p className="text-xs font-semibold text-teal-600">NABL Clinical Service</p>
                        </div>
                      </div>

                      {/* Schedule Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{srv.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{srv.time || "10:00 AM"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Patient: <strong className="text-slate-800">{srv.patientName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Fee */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Total Price</span>
                        <span className="text-base font-extrabold text-slate-900">₹{srv.fees || 499}</span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                        Lab Testing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AppointmentPage;