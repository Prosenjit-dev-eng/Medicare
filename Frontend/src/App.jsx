import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home.jsx";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage.jsx";
import Service from "./components/ServicePage/Service.jsx";
import AppointmentPage from "./components/AppointmentPage/AppointmentPage.jsx";
import ContactPage from "./components/ContactPage/ContactPage.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-white selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<Service />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/doctor-admin/login" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;