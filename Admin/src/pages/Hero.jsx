import React from "react";
import HeroComponent from "../components/Hero/Hero.jsx";

function Hero({ onLoginSuccess }) {
  return <HeroComponent onLoginSuccess={onLoginSuccess} />;
}

export default Hero;