import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect destination and summary data (if any)
  const from = location.state?.from || '/';
  const summaryData = location.state?.summary;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      alert("Login successful!");
      localStorage.setItem("token", res.data.token);

      // Navigate back to previous page (e.g., summary) and include summary if present
      navigate(from, {
        state: summaryData ? { summary: summaryData } : {},
        replace: true, // prevent going back to login page with back button
      });
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2><b>Login</b></h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="form-links">
          <Link to="/password" className="forgot-password">Forgot Password?</Link>
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
