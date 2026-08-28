import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  Menu,
  X,
  User,
  Key,
  Shield,
  Calendar,
  Stethoscope,
  Activity,
  Phone,
  Home,
  ExternalLink,
} from "lucide-react";
import logo from "../../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const clerk = useClerk();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100/80 py-2.5"
          : "bg-white border-b border-emerald-100/50 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="MediCare Logo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  MediCare
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold hidden sm:inline-block">
                  Health
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">
                Healthcare Solutions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Doctor Admin Link */}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doctor Admin</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* User Auth (Clerk or Login Modal) */}
            <SignedOut>
              <button
                onClick={() => {
                  try {
                    clerk.openSignIn();
                  } catch (e) {
                    window.location.href = "/login";
                  }
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-200 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Doctor Admin Portal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <SignedOut>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    try {
                      clerk.openSignIn();
                    } catch (e) {
                      window.location.href = "/login";
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-xs"
                >
                  <Key className="w-4 h-4" />
                  <span>Patient Login</span>
                </button>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Account Profile</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;
