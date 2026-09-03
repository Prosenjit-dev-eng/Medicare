import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  Calendar,
  Grid,
  PlusSquare,
  List,
  LogOut,
  ExternalLink,
  Shield,
  Stethoscope,
  Sun,
  Moon,
} from "lucide-react";
import logoImg from "../../assets/logo.png";

function Navbar({ onLogout }) {
  const navigate = useNavigate();

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

  const role = localStorage.getItem("medicare_admin_role") || "doctor";
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("medicare_admin_user") || "{}");
  } catch {}

  // Filter Nav Items according to user role
  const doctorNavItems = [
    { to: "/", label: "Doctor Dashboard", icon: <Home size={15} /> },
    { to: "/appointments", label: "My Appointments", icon: <Calendar size={15} /> },
  ];

  const adminNavItems = [
    { to: "/", label: "Admin Dashboard", icon: <Home size={15} /> },
    { to: "/appointments", label: "All Appointments", icon: <Calendar size={15} /> },
    { to: "/add", label: "Add Doctor", icon: <UserPlus size={15} /> },
    { to: "/list", label: "List Doctors", icon: <Users size={15} /> },
    { to: "/service-dashboard", label: "Services Hub", icon: <Grid size={15} /> },
    { to: "/add-service", label: "Add Service", icon: <PlusSquare size={15} /> },
    { to: "/list-service", label: "List Services", icon: <List size={15} /> },
    { to: "/service-appointments", label: "Service Bookings", icon: <Calendar size={15} /> },
  ];

  const visibleNavItems = role === "doctor" ? doctorNavItems : adminNavItems;

  const handleLogoutClick = () => {
    localStorage.removeItem("doctorToken_v1");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("medicare_admin_role");
    localStorage.removeItem("medicare_admin_user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-2xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo with Click-to-Toggle Dark/Light Mode */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Click logo to switch to Light Mode" : "Click logo to switch to Dark Mode"}
            className="flex items-center gap-2.5 shrink-0 group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
              <img src={logoImg} alt="MediCare" className="w-full h-full object-contain filter brightness-110" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                {isDark ? <Sun className="w-2.5 h-2.5 text-yellow-300" /> : <Moon className="w-2.5 h-2.5 text-emerald-300" />}
              </span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">MediCare</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    role === "admin"
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  {role === "admin" ? "Super Admin" : "Doctor Portal"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {role === "admin" ? "Operations & Clinic Management" : "Specialist Appointments Hub"}
              </p>
            </div>
          </button>

          {/* Navigation Links - Role Based */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? role === "admin"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Link to Patient Frontend */}
            <a
              href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Patient App</span>
              <ExternalLink size={12} />
            </a>

            {/* Profile Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden md:block">
                <span className="block text-xs font-bold text-slate-800 dark:text-white leading-tight">
                  {user.name || (role === "admin" ? "Super Administrator" : "Dr. Rahul Sharma")}
                </span>
                <span
                  className={`text-[10px] font-semibold capitalize ${
                    role === "admin" ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {role === "admin" ? "System Admin" : "Consultant Doctor"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                title="Log out of portal"
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? role === "admin"
                      ? "bg-blue-600 text-white"
                      : "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

      </div>
    </header>
  );
}

export default Navbar;