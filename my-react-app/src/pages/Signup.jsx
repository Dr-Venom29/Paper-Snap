import React, { useState } from 'react';
import { supabase } from '../supabase/SupabaseClient';
import './Login.css'; // You can use the same CSS file as Login.css
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Show success message
      setMessage({ text: "Account created successfully!", type: 'success' });
      console.log(data);

      // Redirect after short delay
      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      console.error('Signup error:', err);
      const errorMsg = err.message || "Something went wrong.";
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
          <h2>Create Account</h2>
          <p className="subtitle">Join <span className="brand-name">Paper Snap</span> today</p>
        </div>

        {/* Inline Status Message */}
        {message.text && (
          <div className={`status-message ${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Create a strong password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="form-links">
          <p className="signup-text">
            Already have an account? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;