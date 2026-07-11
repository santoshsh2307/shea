import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users_new";
import CreateUser from "./pages/CreateUser_new";
import Profile from "./pages/Profile";
import Services from "./pages/Services";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
