import React, { useState } from 'react';
import { supabase } from '../supabase/SupabaseClient';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';
  const summaryData = location.state?.summary;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Show success message
      setMessage({ text: "Welcome back! Redirecting...", type: 'success' });
      
      // Save token
      localStorage.setItem("token", data.session.access_token);

      // Delay slightly to show the success message
      setTimeout(() => {
        navigate(from, {
          state: summaryData ? { summary: summaryData } : {},
          replace: true,
        });
      }, 1000);

    } catch (err) {
      const errorMsg = err.message || "Connection failed. Please try again.";
      setMessage({ text: errorMsg, type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Ambient Glow Effects */}
      <div className="glow-orb glow-1"></div>
      <div className="glow-orb glow-2"></div>

      <div className="login-form">
        <div className="header-section">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to <span className="brand-name">Paper Snap</span></p>
        </div>

        {/* Inline Status Message (replaces alert) */}
        {message.text && (
          <div className={`status-message ${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
              <span className="input-icon">✉</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <span className="input-icon">✒</span>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="form-links">
          <Link to="/password" className="forgot-password">Forgot Password?</Link>
          <p className="signup-text">
            New here? <Link to="/signup" className="signup-link">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;