import React, { useState } from 'react';
import { supabase } from '../supabase/SupabaseClient';
import './Login.css'; // You can use the same CSS file as Login.css
import { Link } from 'react-router-dom';

const Password = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      // Show success message from backend or generic
      setMessage({ text: "Reset link sent successfully!", type: 'success' });
      setEmail(''); // Clear input on success
    } catch (err) {
      const errorMsg = err.message || 'Failed to send reset link. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
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
          <h2>Forgot Password</h2>
          <p className="subtitle">Recover your <span className="brand-name">Paper Snap</span> account</p>
        </div>

        {/* Inline Status Message */}
        {message.text && (
          <div className={`status-message ${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleForgotPassword}>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <span className="input-icon">✉</span>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="form-links">
          <p className="signup-text">
            Remember your password? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Password;