import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import DashboardPage from "./components/DashboardPage/DashboardPage.jsx";
import AppointmentsPage from "./components/AppointmentsPage/AppointmentsPage.jsx";
import AddPage from "./components/AddPage/AddPage.jsx";
import ListPage from "./components/ListPage/ListPage.jsx";
import ServiceDashboard from "./components/ServiceDashboard/ServiceDashboard.jsx";
import AddService from "./components/AddService/AddService.jsx";
import ListServicePage from "./components/ListServicePage/ListServicePage.jsx";
import ServiceAppointmentsPage from "./components/ServiceAppointmentsPage/ServiceAppointmentsPage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(
      localStorage.getItem("doctorToken_v1") || localStorage.getItem("admin_token")
    );
  });

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("medicare_admin_theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const role = localStorage.getItem("medicare_admin_role") || "doctor";
  const navigate = useNavigate();

  const handleLoginSuccess = (token, userRole, user) => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Hero onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Doctor & Admin Shared Base Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Hero onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/appointments"
          element={
            isAuthenticated ? (
              <AppointmentsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Super Admin-Only Routes (Protected against Doctor Role) */}
        <Route
          path="/add"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <AddPage />
            )
          }
        />

        <Route
          path="/list"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <ListPage />
            )
          }
        />

        <Route
          path="/service-dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <ServiceDashboard />
            )
          }
        />

        <Route
          path="/add-service"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <AddService />
            )
          }
        />

        <Route
          path="/list-service"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <ListServicePage />
            )
          }
        />

        <Route
          path="/service-appointments"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === "doctor" ? (
              <Navigate to="/" replace />
            ) : (
              <ServiceAppointmentsPage />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;