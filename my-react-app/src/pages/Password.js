import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Password = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/password', { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2><b>Forgot Password</b></h2>
        <form onSubmit={handleForgotPassword}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit" className="login-btn">Send verification mail</button>
        </form>
        <div className="form-links">
          <p className="signup-text">
            We’ll send you a link to reset your password <br />
            <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Password;
