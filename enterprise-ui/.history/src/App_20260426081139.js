import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users_new";
import CreateUser from "./pages/CreateUser_new";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import AppLayout from "./components/Layout";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/users" element={<AppLayout><Users /></AppLayout>} />
        <Route path="/create-user" element={<AppLayout><CreateUser /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/services" element={<AppLayout><Services /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
