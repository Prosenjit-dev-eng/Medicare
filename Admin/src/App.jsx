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
  const navigate = useNavigate();

  const handleLoginSuccess = (token, role, user) => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-500 selection:text-white">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Login route */}
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

        {/* Protected Dashboard & Management routes */}
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

        <Route
          path="/add"
          element={
            isAuthenticated ? <AddPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/list"
          element={
            isAuthenticated ? <ListPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/service-dashboard"
          element={
            isAuthenticated ? (
              <ServiceDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/add-service"
          element={
            isAuthenticated ? <AddService /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/list-service"
          element={
            isAuthenticated ? (
              <ListServicePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/service-appointments"
          element={
            isAuthenticated ? (
              <ServiceAppointmentsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;