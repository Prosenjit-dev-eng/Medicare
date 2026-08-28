import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Key, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import logo from "../../assets/logo.png";

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const endpoint = isRegister ? "/api/users/register" : "/api/users/login";

    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem("medicare_patient_token", data.token);
          localStorage.setItem("medicare_patient_user", JSON.stringify(data.user));
        }
        setMessage({ type: "success", text: data.message || "Authentication successful!" });
        setTimeout(() => {
          navigate("/appointments");
        }, 1200);
      } else {
        setMessage({ type: "error", text: data.message || "Authentication failed" });
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Demo fallback login
      localStorage.setItem("medicare_patient_token", "demo_jwt_token_123");
      localStorage.setItem(
        "medicare_patient_user",
        JSON.stringify({ name: formData.name || "Patient User", email: formData.email })
      );
      setMessage({ type: "success", text: "Logged in successfully (Demo Session)" });
      setTimeout(() => {
        navigate("/appointments");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20">
              <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">MediCare</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">
            {isRegister ? "Create Patient Account" : "Patient Portal Login"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister
              ? "Sign up to track medical reports and appointments"
              : "Access your clinical records and booked services"}
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : null}
            <span>{message.text}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                name="email"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}</span>
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage({ type: "", text: "" });
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Doctor Admin Portal Redirect */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-center">
          <span className="text-xs text-slate-600 block mb-1">Are you a healthcare specialist?</span>
          <a
            href="http://localhost:5174"
            className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Go to Doctor Admin Portal</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;