import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("cms_access_token"));
  const [loading, setLoading] = useState(true);

  // Check existing session on first page load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("cms_access_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        setUser(response.data.user);
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.removeItem("cms_access_token");
        localStorage.removeItem("cms_refresh_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Login handler
  const login = async (usernameOrEmail, password) => {
    const response = await api.post("/api/auth/login", {
      username: usernameOrEmail,
      password: password
    });

    const { access_token, refresh_token, user: loggedUser } = response.data;

    localStorage.setItem("cms_access_token", access_token);
    localStorage.setItem("cms_refresh_token", refresh_token);

    setToken(access_token);
    setUser(loggedUser);

    return loggedUser;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("cms_access_token");
    localStorage.removeItem("cms_refresh_token");
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
