import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  Menu,
  X,
  User,
  Key,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import logo from "../../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("medicare_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const location = useLocation();
  const clerk = useClerk();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("medicare_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("medicare_theme", "light");
    }
  }, [isDark]);

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

  const toggleTheme = (e) => {
    // Prevent navigating away if clicking logo to toggle theme
    e.preventDefault();
    setIsDark((prev) => !prev);
  };

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
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-emerald-100/80 dark:border-slate-800 py-2.5"
          : "bg-white dark:bg-slate-900 border-b border-emerald-100/50 dark:border-slate-800 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Clickable Brand Logo with Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Click logo for Light Mode" : "Click logo for Dark Mode"}
            className="flex items-center gap-3 group text-left cursor-pointer transition-transform duration-200 active:scale-95"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="MediCare Logo" className="w-full h-full object-contain filter brightness-110" />
              
              {/* Floating Theme Icon Badge on Logo */}
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-white dark:border-slate-900 text-[10px] transition-all">
                {isDark ? <Sun className="w-3 h-3 text-yellow-300 animate-spin" style={{ animationDuration: "10s" }} /> : <Moon className="w-3 h-3 text-emerald-300" />}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  MediCare
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold hidden sm:inline-block">
                  {isDark ? "Dark" : "Health"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                Healthcare Solutions
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-700">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-slate-700"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-200 dark:border-slate-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Doctor Admin</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* User Auth */}
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
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    baseTheme: isDark ? dark : undefined,
                    variables: {
                      colorPrimary: "#10b981",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
                      : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-sm font-bold border border-emerald-200 dark:border-slate-700"
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
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Account Profile</span>
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
