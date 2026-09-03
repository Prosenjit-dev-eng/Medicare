import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Globe,
} from "lucide-react";
import logo from "../../assets/logo.png";

// Clean inline SVGs for social platforms
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctors" },
    { name: "Diagnostic Services", href: "/services" },
    { name: "Appointments", href: "/appointments" },
    { name: "Contact Helpdesk", href: "/contact" },
  ];

  const ourServices = [
    { name: "Blood Pressure Check", href: "/services" },
    { name: "Blood Sugar Test", href: "/services" },
    { name: "Diet & Nutrition Counselling", href: "/services" },
    { name: "Full Body Health Checkup", href: "/services" },
    { name: "Digital X-Ray Scan", href: "/services" },
    { name: "Thyroid & Hormone Profile", href: "/services" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: "https://www.facebook.com",
      color: "hover:text-blue-500 hover:bg-slate-700",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      href: "https://twitter.com",
      color: "hover:text-sky-400 hover:bg-slate-700",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://instagram.com",
      color: "hover:text-pink-400 hover:bg-slate-700",
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      href: "https://www.linkedin.com/in/prosenjit-hawlader-a9744932b/",
      color: "hover:text-blue-400 hover:bg-slate-700",
    },
    {
      name: "YouTube",
      icon: YoutubeIcon,
      href: "https://youtube.com",
      color: "hover:text-red-500 hover:bg-slate-700",
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="MediCare Logo" className="w-10 h-10 object-contain rounded-xl" />
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">MediCare</span>
                <span className="text-xs text-emerald-400 font-semibold block">Healthcare Solutions</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              MediCare Healthcare Solutions connects patients with certified clinical specialists and NABL accredited diagnostic screening for premium, accessible healthcare.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+918299431275" className="hover:text-emerald-400 transition-colors">
                  +91 6289644619
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:hexagonsservices@gmail.com" className="hover:text-emerald-400 transition-colors">
                  techprosenjit45@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Barasat, Kolkata, India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>›</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Our Services */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              {ourServices.map((srv) => (
                <li key={srv.name}>
                  <Link
                    to={srv.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>›</span>
                    <span>{srv.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Stay Connected Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Stay Connected</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for health tips, medical updates, and wellness insights delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>

              {subscribed && (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thank you for subscribing!</span>
                </div>
              )}
            </form>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                {socialLinks.map(({ name, icon: Icon, href, color }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className={`w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center transition-all ${color}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>© {new Date().getFullYear()} MediCare - Healthcare Solutions. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <a href="http://localhost:5174" className="text-emerald-400 font-semibold hover:underline">
              Doctor Admin Portal →
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;