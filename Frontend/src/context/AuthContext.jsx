import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const clerk = useClerk();

  const [localUser, setLocalUser] = useState(() => {
    try {
      const saved = localStorage.getItem("medicare_patient_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [localToken, setLocalToken] = useState(() => {
    return localStorage.getItem("medicare_patient_token") || null;
  });

  const syncLocalAuth = useCallback(() => {
    try {
      const savedUser = localStorage.getItem("medicare_patient_user");
      const savedToken = localStorage.getItem("medicare_patient_token");
      setLocalUser(savedUser ? JSON.parse(savedUser) : null);
      setLocalToken(savedToken || null);
    } catch (e) {
      setLocalUser(null);
      setLocalToken(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLocalAuth);
    window.addEventListener("medicare_auth_change", syncLocalAuth);
    return () => {
      window.removeEventListener("storage", syncLocalAuth);
      window.removeEventListener("medicare_auth_change", syncLocalAuth);
    };
  }, [syncLocalAuth]);

  // Unified status: either Clerk or custom patient login
  const isSignedIn = Boolean(clerkSignedIn || (localToken && localUser));
  const isLoaded = clerkLoaded;

  // Unified user profile object
  let user = null;
  if (clerkSignedIn && clerkUser) {
    const clerkFullName =
      clerkUser.fullName ||
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      "Patient User";
    const clerkEmail =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      "";
    const clerkPhone =
      clerkUser.primaryPhoneNumber?.phoneNumber ||
      clerkUser.phoneNumbers?.[0]?.phoneNumber ||
      clerkUser.unsafeMetadata?.phone ||
      "";

    user = {
      id: clerkUser.id,
      name: clerkFullName,
      email: clerkEmail,
      phone: clerkPhone,
      avatar: clerkUser.imageUrl,
      isClerk: true,
    };
  } else if (localUser && localToken) {
    user = {
      id: localUser._id || localUser.id || `patient_${localUser.email || Date.now()}`,
      name: localUser.name || "Patient User",
      email: localUser.email || "",
      phone: localUser.phone || "",
      avatar: null,
      isClerk: false,
      token: localToken,
    };
  }

  const openLogin = useCallback((options = {}) => {
    try {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn(options);
        return;
      }
    } catch (e) {
      console.warn("Clerk openSignIn unavailable, routing to /login:", e);
    }
    window.location.href = "/login";
  }, [clerk]);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem("medicare_patient_token");
      localStorage.removeItem("medicare_patient_user");
      window.dispatchEvent(new Event("medicare_auth_change"));
      setLocalUser(null);
      setLocalToken(null);
      if (clerkSignedIn && clerk) {
        await clerk.signOut();
      }
    } catch (e) {
      console.warn("Sign out notice:", e);
    }
  }, [clerk, clerkSignedIn]);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded,
        user,
        token: localToken,
        openLogin,
        signOut,
        syncLocalAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
