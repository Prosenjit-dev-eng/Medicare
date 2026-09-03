import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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
  const { user, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("doctor"); // "doctor" | "service"
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [serviceAppointments, setServiceAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentNotice, setPaymentNotice] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  // Check for Stripe Checkout return redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const appointmentId = searchParams.get("appointment_id");
    const serviceAppointmentId = searchParams.get("service_appointment_id");
    const status = searchParams.get("status");

    if (sessionId && status === "success") {
      if (appointmentId) {
        fetch(`${API_BASE_URL}/appointments/confirm?session_id=${sessionId}&appointment_id=${appointmentId}`)
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
          `${API_BASE_URL}/service-appointments/confirm?session_id=${sessionId}&service_appointment_id=${serviceAppointmentId}`
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
    if (!isLoaded) return;
    setLoading(true);

    const clerkUserId = user?.id || null;
    const userEmail = user?.primaryEmailAddress?.emailAddress || null;

    let serverDocs = [];
    let serverSrvs = [];

    // If user is not signed in at all, clear lists and stop
    if (!isSignedIn) {
      setDoctorAppointments([]);
      setServiceAppointments([]);
      setLoading(false);
      return;
    }

    try {
      const docParams = new URLSearchParams();
      if (clerkUserId) docParams.append("createdBy", clerkUserId);
      if (userEmail) docParams.append("email", userEmail);

      const srvParams = new URLSearchParams();
      if (clerkUserId) srvParams.append("createdBy", clerkUserId);
      if (userEmail) srvParams.append("email", userEmail);

      const resDoc = await fetch(`${API_BASE_URL}/appointments?${docParams.toString()}`);
      const dataDoc = await resDoc.json();
      if (dataDoc.success && dataDoc.appointments) {
        serverDocs = dataDoc.appointments;
      }

      const resSrv = await fetch(`${API_BASE_URL}/service-appointments?${srvParams.toString()}`);
      const dataSrv = await resSrv.json();
      if (dataSrv.success && dataSrv.appointments) {
        serverSrvs = dataSrv.appointments;
      }
    } catch (err) {
      console.warn("Backend appointments fetch notice:", err);
    }

    // Merge with client-side localStorage bookings (strictly matching current user)
    try {
      const isUserMatch = (item) => {
        if (!item) return false;
        if (clerkUserId && item.createdBy === clerkUserId) return true;
        if (userEmail && item.email && item.email.toLowerCase() === userEmail.toLowerCase()) return true;
        return false;
      };

      const localDocs = JSON.parse(localStorage.getItem("medicare_patient_appointments") || "[]").filter(isUserMatch);
      const localSrvs = JSON.parse(localStorage.getItem("medicare_patient_service_appointments") || "[]").filter(isUserMatch);

      const combinedDocs = [...localDocs, ...serverDocs];
      const uniqueDocs = Array.from(
        new Map(combinedDocs.map((item) => [item._id || item.date + item.time, item])).values()
      );

      const combinedSrvs = [...localSrvs, ...serverSrvs];
      const uniqueSrvs = Array.from(
        new Map(combinedSrvs.map((item) => [item._id || item.date + item.time, item])).values()
      );

      setDoctorAppointments(uniqueDocs);
      setServiceAppointments(uniqueSrvs);
    } catch (e) {
      setDoctorAppointments(serverDocs);
      setServiceAppointments(serverSrvs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchAppointments();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Completed
          </span>
        );
      case "Canceled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
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
            ? "bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
            : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Payment confirmation alert */}
        {paymentNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold">{paymentNotice}</span>
            </div>
            <button
              onClick={() => setPaymentNotice(null)}
              className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Patient <span className="text-emerald-600 dark:text-emerald-400">Appointments Dashboard</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Review your scheduled doctor consultations, diagnostic lab services, and track payment receipts.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {!isSignedIn && isLoaded ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sign in to view your appointments</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Please sign in with your account to access your personal scheduled consultations, diagnostic bookings, and receipts.
            </p>
          </div>
        ) : (
          <>
            {/* Tab Switcher: Doctor Appointments vs Booked Services */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab("doctor")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "doctor"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Your Doctor Appointments ({doctorAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("service")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "service"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
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
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
                <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No doctor appointments found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">You haven't scheduled any doctor consultations yet.</p>
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
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between mb-4">
                        {getStatusBadge(app.status)}
                        {getPaymentBadge(app.payment)}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{app.doctorName || "Doctor Consultation"}</h4>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{app.speciality || "Specialist"}</p>
                        </div>
                      </div>

                      {/* Schedule Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-white">{app.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-white">{app.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Patient: <strong className="text-slate-800 dark:text-white">{app.patientName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Fee */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 uppercase font-semibold block">Fee Paid</span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{app.fees || 500}</span>
                      </div>
                      <a
                        href="tel:+918299431275"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 font-semibold"
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
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
                <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No diagnostic services booked</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">You haven't booked any lab tests or diagnostic scans yet.</p>
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
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between mb-4">
                        {getStatusBadge(srv.status)}
                        {getPaymentBadge(srv.payment)}
                      </div>

                      {/* Service Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shrink-0">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{srv.serviceName || "Diagnostic Test"}</h4>
                          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">NABL Clinical Service</p>
                        </div>
                      </div>

                      {/* Schedule Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-white">{srv.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-white">{srv.time || "10:00 AM"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>Patient: <strong className="text-slate-800 dark:text-white">{srv.patientName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Fee */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 uppercase font-semibold block">Total Price</span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{srv.fees || 499}</span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                        Lab Testing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </>
        )}

      </div>
    </div>
  );
}

export default AppointmentPage;