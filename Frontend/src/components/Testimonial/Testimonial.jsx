import React, { useRef, useState } from "react";
import { Star, Quote, Stethoscope, User, HeartHandshake } from "lucide-react";

const doctorTestimonials = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Senior Cardiologist",
    rating: 5,
    text: "The MediCare platform has drastically streamlined our clinical appointment workflow. Patient history access is instantaneous and digital prescription tracking saves hours weekly.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    hospital: "Apollo Heart Institute",
  },
  {
    id: 2,
    name: "Dr. Robert Martinez",
    role: "Lead Pediatrician",
    rating: 5,
    text: "Automated schedule management and zero no-show rates due to real-time SMS/WhatsApp reminders have transformed our private pediatric practice.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    hospital: "Fortis Healthcare",
  },
  {
    id: 3,
    name: "Dr. Amanda Lee",
    role: "Dermatologist & Cosmetologist",
    rating: 5,
    text: "Online diagnostic service booking paired with integrated Stripe payments offers our patients the smoothest experience possible.",
    image: "https://images.unsplash.com/photo-1594824813570-5b5830b05b51?auto=format&fit=crop&w=300&q=80",
    hospital: "Max Super Speciality",
  },
  {
    id: 4,
    name: "Dr. Arvind Saxena",
    role: "Consultant Neurologist",
    rating: 5,
    text: "The patient management UI is intuitive and secure. Managing hundreds of outpatient consultations has never been this seamless.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    hospital: "Medanta Medicity",
  },
];

const patientTestimonials = [
  {
    id: 5,
    name: "Michael Chen",
    role: "Patient - Full Body Checkup",
    rating: 5,
    text: "Booking the comprehensive diagnostic health checkup took under 2 minutes. The home sample collection and online report delivery were flawless.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    city: "Lucknow",
  },
  {
    id: 6,
    name: "Emily Williams",
    role: "Patient - Cardiology Consultation",
    rating: 5,
    text: "Finding a verified cardiologist and securing a prime morning appointment slot without queueing at the hospital gave my family peace of mind.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    city: "Kanpur",
  },
  {
    id: 7,
    name: "David Thompson",
    role: "Patient - Diabetes Care",
    rating: 5,
    text: "The blood sugar and lipid profile package was affordable and the doctor consultation included clear, actionable lifestyle steps.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    city: "Lucknow",
  },
  {
    id: 8,
    name: "Ananya Sharma",
    role: "Patient - Pediatric Checkup",
    rating: 5,
    text: "Superb experience! We booked a weekend slot for our toddler's vaccination and routine exam. Zero waiting room hassles.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    city: "Varanasi",
  },
];

function Testimonial() {
  const [isPaused, setIsPaused] = useState(false);

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-linear-to-b from-white via-emerald-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            Voices of Trust
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Loved by <span className="text-emerald-600">Doctors</span> & Trusted by <span className="text-teal-600">Patients</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Hear directly from medical specialists who power our consultations and patients whose lives are enhanced every day.
          </p>
        </div>

        {/* Dual Column Testimonials */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column: Medical Professionals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-200">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Medical Professionals</h3>
                <p className="text-xs text-emerald-600 font-medium">Physicians, Surgeons & Specialists</p>
              </div>
            </div>

            <div className="space-y-4">
              {doctorTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 relative group"
                >
                  <Quote className="absolute top-4 right-4 w-7 h-7 text-emerald-100 group-hover:text-emerald-200 transition-colors pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-emerald-300 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h4>
                          <p className="text-xs text-emerald-600 font-medium">{item.role} • {item.hospital}</p>
                        </div>
                        {renderStars(item.rating)}
                      </div>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{item.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Patients */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-teal-200">
              <div className="p-2 rounded-xl bg-teal-600 text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Patients & Families</h3>
                <p className="text-xs text-teal-600 font-medium">Real experiences from our clinic network</p>
              </div>
            </div>

            <div className="space-y-4">
              {patientTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-teal-100 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-300 relative group"
                >
                  <Quote className="absolute top-4 right-4 w-7 h-7 text-teal-100 group-hover:text-teal-200 transition-colors pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-teal-300 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h4>
                          <p className="text-xs text-teal-600 font-medium">{item.role} • {item.city}</p>
                        </div>
                        {renderStars(item.rating)}
                      </div>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{item.text}"
                      </p>
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