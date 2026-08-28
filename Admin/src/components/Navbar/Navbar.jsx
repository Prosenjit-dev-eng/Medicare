import React from "react";
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
} from "lucide-react";
import logoImg from "../../assets/logo.png";

const navItems = [
  { to: "/", label: "Doctor Dashboard", icon: <Home size={15} /> },
  { to: "/appointments", label: "Appointments", icon: <Calendar size={15} /> },
  { to: "/add", label: "Add Doctor", icon: <UserPlus size={15} /> },
  { to: "/list", label: "List Doctors", icon: <Users size={15} /> },
  { to: "/service-dashboard", label: "Services Hub", icon: <Grid size={15} /> },
  { to: "/add-service", label: "Add Service", icon: <PlusSquare size={15} /> },
  { to: "/list-service", label: "List Services", icon: <List size={15} /> },
  { to: "/service-appointments", label: "Service Bookings", icon: <Calendar size={15} /> },
];

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("medicare_admin_role") || "doctor";
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("medicare_admin_user") || "{}");
  } catch {}

  const handleLogoutClick = () => {
    localStorage.removeItem("doctorToken_v1");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("medicare_admin_role");
    localStorage.removeItem("medicare_admin_user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-sm">
              <img src={logoImg} alt="MediCare" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900">MediCare</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {role === "admin" ? "Super Admin" : "Doctor Portal"}
                </span>
              </div>
              <p className="text-[10px] font-medium text-emerald-600">Operations Control</p>
            </div>
          </Link>

          {/* Navigation Links Scroll Container */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 px-2 bg-slate-50/80 rounded-2xl border border-slate-200/80 scrollbar-none">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Logout */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Patient Portal link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Patient App</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* User Details & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">
                  {user.name || (role === "admin" ? "Super Admin" : "Doctor")}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium capitalize block">
                  {role}
                </span>
              </div>

              <button
                onClick={handleLogoutClick}
                title="Log Out"
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
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