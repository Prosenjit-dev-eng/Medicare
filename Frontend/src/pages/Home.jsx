import React from "react";
import Hero from "../components/Hero/Hero.jsx";
import Certification from "../components/Certification/Certification.jsx";
import HomeDoctors from "../components/HomeDoctors/HomeDoctors.jsx";
import Testimonial from "../components/Testimonial/Testimonial.jsx";

function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <Hero />

      {/* Accreditations Marquee */}
      <Certification />

      {/* Featured Doctors Grid */}
      <HomeDoctors />

      {/* Voices of Trust Testimonials */}
      <Testimonial />
    </main>
  );
}

export default Home;