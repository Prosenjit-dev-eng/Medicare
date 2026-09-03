import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("VITE_CLERK_PUBLISHABLE_KEY is not defined in .env. Clerk auth will be disabled.");
}

function Root() {
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("medicare_theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    // Observe DOM class change on <html> element when logo is clicked
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY || "pk_test_placeholder"}
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: "#10b981",
          colorBackground: isDark ? "#0f172a" : "#ffffff",
          colorText: isDark ? "#f8fafc" : "#0f172a",
          colorInputBackground: isDark ? "#1e293b" : "#f8fafc",
          colorInputText: isDark ? "#ffffff" : "#0f172a",
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
