import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Key, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sun, Moon } from "lucide-react";
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

  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("medicare_theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("medicare_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("medicare_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setIsDark((prev) => !prev);
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 dark:border-slate-800 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-200/50 dark:bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Header with Theme Toggle */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Click logo to switch to Light Mode" : "Click logo to switch to Dark Mode"}
            className="inline-flex items-center gap-2.5 mb-2 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <img src={logo} alt="Logo" className="w-full h-full object-contain filter brightness-110" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                {isDark ? <Sun className="w-2.5 h-2.5 text-yellow-300" /> : <Moon className="w-2.5 h-2.5 text-emerald-300" />}
              </span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MediCare</span>
          </button>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {isRegister ? "Create Patient Account" : "Patient Portal Login"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : "bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                name="email"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login vs Register */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage({ type: "", text: "" });
              }}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Doctor Admin Redirection */}
        <div className="mt-4 text-center">
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Looking for Doctor Admin Portal? Click here</span>
          </a>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;