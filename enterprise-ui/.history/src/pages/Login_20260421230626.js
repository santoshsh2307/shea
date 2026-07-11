import React, { useState } from "react";
import { Card, Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      message.error("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ username, password });
      
      if (response.data.success) {
        message.success("Login Successful");
        // Store user info in localStorage for later use
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        message.error(response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.response?.data?.message || "Login Failed - Backend may not be running");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Spin spinning={loading}>
        <Card title="Sign In" style={{ width: 350 }}>
          <Input 
            placeholder="Username" 
            onChange={e => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Input.Password 
            placeholder="Password" 
            style={{ marginTop: 10 }} 
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button 
            type="primary" 
            block 
            style={{ marginTop: 20 }} 
            onClick={login}
            loading={loading}
          >
            Login
          </Button>
        </Card>
      </Spin>
    </div>
  );
}

export default Login;
