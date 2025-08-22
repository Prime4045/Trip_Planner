import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Check auth status on mount
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthState({ isAuthenticated: false, user: null, token: null });
        return;
      }

      // Call backend to validate token
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setAuthState({ isAuthenticated: false, user: null, token: null });
        return;
      }

      const userData = await res.json();
      setAuthState({ isAuthenticated: true, user: userData, token });
    } catch (error) {
      console.error("Auth status check failed:", error);
      setAuthState({ isAuthenticated: false, user: null, token: null });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
