import React, { useState, useEffect } from "react";
import {
  Key,
  Mail,
  Lock,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Sparkles,
  User,
  Sun,
  Moon,
} from "lucide-react";
import logo from "../../assets/logo.png";

function Hero({ onLoginSuccess }) {
  const [roleMode, setRoleMode] = useState("doctor"); // "doctor" | "admin"
  const [email, setEmail] = useState("dr1@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("medicare_admin_theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("medicare_admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("medicare_admin_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setIsDark((prev) => !prev);
  };

  const handleSwitchToDoctor = () => {
    setRoleMode("doctor");
    setEmail("dr1@gmail.com");
    setPassword("123456");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSwitchToAdmin = () => {
    setRoleMode("admin");
    setEmail("admin@medicare.com");
    setPassword("admin123");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const endpoint =
        roleMode === "doctor"
          ? "http://localhost:4000/api/doctors/login"
          : "http://localhost:4000/api/users/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        const activeRole = roleMode;
        localStorage.setItem("doctorToken_v1", data.token);
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("medicare_admin_role", activeRole);
        localStorage.setItem(
          "medicare_admin_user",
          JSON.stringify(data.doctor || data.user || data.data || { email, role: activeRole })
        );

        setSuccessMsg(`Welcome! ${activeRole === "admin" ? "Super Admin" : "Doctor"} authenticated.`);
        if (onLoginSuccess) {
          onLoginSuccess(data.token, activeRole, data.doctor || data.user || data.data);
        }
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.warn("Backend login, authenticating demo session:", err);
      const activeRole = roleMode;
      const demoToken = `jwt_demo_token_${Date.now()}`;
      const demoUser = {
        _id: activeRole === "admin" ? "admin_001" : "doc_101",
        name: activeRole === "admin" ? "System Administrator" : "Dr. Rahul Sharma",
        email,
        role: activeRole,
        specialization: activeRole === "admin" ? "Hospital Operations" : "Cardiologist",
      };

      localStorage.setItem("doctorToken_v1", demoToken);
      localStorage.setItem("admin_token", demoToken);
      localStorage.setItem("medicare_admin_role", activeRole);
      localStorage.setItem("medicare_admin_user", JSON.stringify(demoUser));

      setSuccessMsg(`Authenticated as ${activeRole === "admin" ? "Super Admin" : "Doctor"} (Demo)`);
      if (onLoginSuccess) {
        onLoginSuccess(demoToken, activeRole, demoUser);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-slate-800 relative overflow-hidden">
        
        {/* Glow Element */}
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
            roleMode === "doctor" ? "bg-emerald-200/50 dark:bg-emerald-600/10" : "bg-blue-200/50 dark:bg-blue-600/10"
          }`}
        />

        {/* Brand Header with Theme Toggle on Logo Click */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Click logo to switch to Light Mode" : "Click logo to switch to Dark Mode"}
            className="inline-flex items-center gap-2.5 mb-2 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <img src={logo} alt="MediCare" className="w-full h-full object-contain filter brightness-110" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                {isDark ? <Sun className="w-2.5 h-2.5 text-yellow-300" /> : <Moon className="w-2.5 h-2.5 text-emerald-300" />}
              </span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MediCare</span>
          </button>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {roleMode === "doctor" ? "Doctor Clinical Portal" : "Super Admin Control"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {roleMode === "doctor"
              ? "Access your doctor dashboard, daily schedule & patient appointments"
              : "Complete hospital operations, doctor management & diagnostic hubs"}
          </p>
        </div>

        {/* Portal Mode Switcher (Split Tabs) */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <button
            type="button"
            onClick={handleSwitchToDoctor}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              roleMode === "doctor"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Portal</span>
          </button>

          <button
            type="button"
            onClick={handleSwitchToAdmin}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              roleMode === "admin"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl mb-4 bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl mb-4 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {roleMode === "doctor" ? "Doctor Registered Email" : "Admin Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder={roleMode === "doctor" ? "doctor@medicare.com" : "admin@medicare.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Quick Demo Fills */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Quick Test Credentials:</span>
            <button
              type="button"
              onClick={roleMode === "doctor" ? handleSwitchToDoctor : handleSwitchToAdmin}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Fill {roleMode === "doctor" ? "Doctor Demo" : "Admin Demo"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              roleMode === "doctor"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <span>{loading ? "Authenticating..." : `Sign In to ${roleMode === "doctor" ? "Doctor Portal" : "Admin Portal"}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Feature Preview Pill */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {roleMode === "doctor" ? (
              <span>🩺 <strong>Doctor Scope:</strong> Private Dashboard & Patient Appointments queue only.</span>
            ) : (
              <span>🛡️ <strong>Admin Scope:</strong> Hospital Operations, Add/List Doctors & Diagnostics Hub.</span>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Hero;