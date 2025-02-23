LocalStorage vs. SessionStorage?
Storage Type |	Persists After Refresh | Persists After Closing Browser |	Use Case
localStorage	|✅ Yes                 |	✅ Yes                        |	Good for "Remember Me" login
sessionStorage |	✅ Yes                |	❌ No                         |	Best for temporary authentication (logs out on close)

Best Practice: Use localStorage for long-term authentication, but never store sensitive information like passwords or full JWT tokens in localStorage because they are vulnerable to XSS attacks. 
Instead, use httpOnly cookies for security.

import React, { createContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken); // Fetch user details
    }
  }, []);

  // Fake API call to get user info
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("https://api.example.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unauthorized");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      logout();
    }
  };

  // Login function (API call)
  const login = async (email, password) => {
    try {
      const response = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        fetchUserData(data.token); // Fetch user info after login
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for Authentication
export const useAuth = () => {
  return useContext(AuthContext);
};

import React, { useState } from "react";
import { useAuth } from "./useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;


import React from "react";
import { useAuth } from "./useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
  
    </div>
  );
};

export default Dashboard;


import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <div>
      <p>Please log in to access the dashboard.</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>;
};

export default ProtectedRoute;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
