import React from "react";
import C1 from "../../assets/C1.png";
import C2 from "../../assets/C2.png";
import C3 from "../../assets/C3.png";
import C4 from "../../assets/C4.svg";
import C5 from "../../assets/C5.png";
import C6 from "../../assets/C6.png";
import C7 from "../../assets/C7.svg";

const certifications = [
  { id: 1, name: "Medical Commission", image: C1, type: "international" },
  { id: 2, name: "Government Approved", image: C2, type: "government" },
  { id: 3, name: "NABH Accredited", image: C3, type: "healthcare" },
  { id: 4, name: "Medical Council", image: C4, type: "government" },
  { id: 5, name: "Quality Healthcare", image: C5, type: "healthcare" },
  { id: 6, name: "Paramedical Council", image: C6, type: "healthcare" },
  { id: 7, name: "Ministry of Health", image: C7, type: "government" },
];

const duplicatedCertifications = [
  ...certifications,
  ...certifications,
  ...certifications,
  ...certifications,
];

function Certification() {
  return (
    <section className="relative py-12 bg-linear-to-r from-emerald-50/80 via-teal-50/50 to-green-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-y border-emerald-100/60 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-3 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          National & Global Healthcare Accreditations
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Recognized by <span className="text-emerald-600 dark:text-emerald-400">Leading Medical Councils</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2">
          MediCare adheres strictly to NABH protocols, Ministry of Health guidelines, and international clinical benchmarks.
        </p>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-emerald-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
          {duplicatedCertifications.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-100/80 dark:border-slate-700 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 min-w-[170px] group"
            >
              <div className="w-16 h-16 flex items-center justify-center p-2 rounded-xl bg-emerald-50/60 dark:bg-slate-700/60 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="mt-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 text-center leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default Certification;