import React from "react";
import { Star, Quote, HeartHandshake, Stethoscope } from "lucide-react";
import D1 from "../../assets/D1.png";
import D2 from "../../assets/D2.png";
import D3 from "../../assets/D3.png";
import HD1 from "../../assets/HD1.png";
import HD2 from "../../assets/HD2.png";
import HD3 from "../../assets/HD3.png";

const doctorTestimonials = [
  {
    id: "doc-1",
    name: "Dr. Rajesh K. Tiwari",
    role: "MD, Senior Cardiologist",
    hospital: "Apollo Healthcare, Lucknow",
    image: D1,
    rating: 5,
    quote:
      "MediCare's digital triage and slot scheduling system has transformed our clinic workflow. Patient records and pre-consult history are structured seamlessly.",
  },
  {
    id: "doc-2",
    name: "Dr. Meenakshi Sunder",
    role: "Head of Dermatology",
    hospital: "Max Super Specialty",
    image: D2,
    rating: 5,
    quote:
      "The diagnostic booking integration allows me to prescribe diagnostic packages with direct preparation guidelines that patients understand before coming in.",
  },
  {
    id: "doc-3",
    name: "Dr. Alok Srivastava",
    role: "Consultant Pediatrician",
    hospital: "Medanta Medicity",
    image: D3,
    rating: 5,
    quote:
      "From emergency call handling to automated follow-up appointments, MediCare ensures no patient falls through the cracks. Highly recommended for clinical practitioners.",
  },
];

const patientTestimonials = [
  {
    id: "pat-1",
    name: "Pooja Deshmukh",
    role: "Verified Patient",
    location: "Gomtinagar, Lucknow",
    image: HD1,
    rating: 5,
    quote:
      "Booking a cardiology consult was hassle-free! I received an instant confirmation, arrived on time, and was attended to with zero waiting room queues.",
  },
  {
    id: "pat-2",
    name: "Saurabh Mehrotra",
    role: "Verified Patient",
    location: "Aliganj, Lucknow",
    image: HD2,
    rating: 5,
    quote:
      "I booked the Full Body Health Checkup online. The payment via Stripe was super smooth and the sample collection at the clinic was totally stress-free.",
  },
  {
    id: "pat-3",
    name: "Rituja Sen",
    role: "Verified Patient",
    location: "Hazratganj, Lucknow",
    image: HD3,
    rating: 5,
    quote:
      "The WhatsApp contact option is brilliant! I was able to clarify my mother's appointment time in seconds directly with the clinic reception.",
  },
];

function Testimonial() {
  return (
    <section className="py-20 bg-linear-to-b from-white via-emerald-50/40 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Voices of Trust
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by <span className="text-emerald-600 dark:text-emerald-400">Doctors</span> & Trusted by <span className="text-teal-600 dark:text-teal-400">Patients</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Discover real stories from premier medical practitioners delivering care and patients experiencing healthy recoveries.
          </p>
        </div>

        {/* 2-Column Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Column 1: Medical Professionals */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-500/40">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Medical Professionals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Practitioners & Clinical Specialists</p>
              </div>
            </div>

            <div className="space-y-4">
              {doctorTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 relative group"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-100 dark:text-slate-800 group-hover:text-emerald-200 transition-colors pointer-events-none" />
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4">
                    "{item.quote}"
                  </p>

                  <div className="flex items-center gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/60"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{item.role}</p>
                      <p className="text-[11px] text-slate-400">{item.hospital}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Patients */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-500/40">
              <div className="p-2.5 rounded-xl bg-teal-500 text-white shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Patient Experiences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real Stories of Care & Healing</p>
              </div>
            </div>

            <div className="space-y-4">
              {patientTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200 relative group"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-teal-100 dark:text-slate-800 group-hover:text-teal-200 transition-colors pointer-events-none" />
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4">
                    "{item.quote}"
                  </p>

                  <div className="flex items-center gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/60"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{item.role}</p>
                      <p className="text-[11px] text-slate-400">📍 {item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Testimonial;