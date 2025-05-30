import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // ✅ added useNavigate
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ hook to redirect

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      alert('Signup successful! ✅');
      console.log(res.data);
      navigate('/login'); // ✅ redirect to login
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed ❌');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2><b>Sign Up</b></h2>
        <form onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
        <div className="form-links">
          <p className="signup-text">
            Have an account already? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
