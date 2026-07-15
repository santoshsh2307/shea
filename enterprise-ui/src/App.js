import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users_new";
import CreateUser from "./pages/CreateUser_new";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import AppLayout from "./components/Layout";

const isAuthenticated = () => {
  try {
    return !!localStorage.getItem("user");
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/users"
          element={<ProtectedRoute><AppLayout><Users /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/create-user"
          element={<ProtectedRoute><AppLayout><CreateUser /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/services"
          element={<ProtectedRoute><AppLayout><Services /></AppLayout></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
