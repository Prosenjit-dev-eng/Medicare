import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  UserCheck,
  Users,
  CalendarCheck,
  PhoneCall,
  Sparkles,
  Star,
  Activity,
} from "lucide-react";
import BannerImg from "../../assets/BannerImg.png";

function Hero() {
  const pills = [
    { label: "Certified Specialists", icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60" },
    { label: "24/7 Availability", icon: Clock, color: "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60" },
    { label: "Safe & Secure", icon: ShieldCheck, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/60" },
    { label: "500+ Doctors", icon: Users, color: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60" },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/70 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 lg:py-20 transition-colors duration-300">
      {/* Background ambient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-200/30 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800/80 shadow-xs backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                India's Trusted Healthcare Network
              </span>
              <div className="flex gap-0.5 ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Medi Care+{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-tr from-emerald-600 via-teal-500 to-green-500 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
                Premium Healthcare
              </span>{" "}
              At Your Fingertips
            </h1>

            {/* Subtitle description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Connect with top-rated medical specialists, schedule comprehensive diagnostic tests, and access world-class patient care all in one unified digital hospital ecosystem.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {pills.map((pill, index) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200"
                  >
                    <div className={`p-1.5 rounded-lg ${pill.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {pill.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/doctors"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Appointment Now</span>
              </Link>

              <a
                href="tel:+918299431275"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-base border border-red-200/80 dark:border-red-800/80 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Emergency Call</span>
              </a>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Instant Online Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Doctors Live Now</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl transform rotate-2 scale-105 filter blur-xs" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900">
                <img
                  src={BannerImg}
                  alt="Doctor consultation banner"
                  className="w-full h-auto object-cover max-h-125"
                />
              </div>

              {/* Floating Satisfaction badge */}
              <div className="absolute bottom-2 left-2 sm:-bottom-5 sm:-left-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  98%
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">Patient Satisfaction</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Over 25,000+ happy visits</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
