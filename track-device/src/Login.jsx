import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleLogin = () => {
    if(username === "admin" && password === "1234"){
      navigate("/dashboard");
    }else{
      setError("Invalid username or password");
    }
  }

  return (
    <div className="main-container">

      <div className="login-card">

        <h2>📍 Device Tracker</h2>
        <p className="subtitle">Admin Login</p>

        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        />

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {error && <p className="error">{error}</p>}

      </div>

    </div>
  );
};

export default Login;