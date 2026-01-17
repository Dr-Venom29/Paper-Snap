import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './web-logo.png';
import profile from './profile.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    queryType: '',
    email: '',
    message: '',
  });

  const handleClick = () => navigate('/login');

  const handleContactClick = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  const handleProfileClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/');
  };

  const scrollToComponent2 = (e) => {
    e.preventDefault();
    document.getElementById('component2')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ queryType: '', email: '', message: '' });
        setShowForm(false);
      } else {
        alert('Error sending message');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };

  const isSummaryPage = location.pathname === '/summary';

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img className="logo" src={logo} alt="Paper Snap Logo" />
        </div>

        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/" onClick={scrollToComponent2}>Features</Link>
          <Link to="/contact" onClick={handleContactClick}>Contact Us</Link>
          
          {localStorage.getItem('token') ? (
            <img
              src={profile}
              alt="Profile"
              className="profile-icon"
              onClick={handleProfileClick}
              title="Profile"
            />
          ) : (
            <button onClick={handleClick} className="login-btn">Login</button>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      {!isSummaryPage && (
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="brand-name">Paper Snap</span><span className="colon">:</span> Turn Any Research Paper Into Clear Summary
          </h1>
          <p className="hero-description">
            It is a free tool that quickly turns your research papers into clear, concise summaries. 
            Leverage the power of the RAG model to summarize documents effortlessly and gain relevant insights in no time.
          </p>
          
          <div className="hero-input-group">
            <input 
              placeholder="Your Email address" 
              className="hero-input" 
              name="email" 
              type="email" 
            />
            <button type="button" className="get-started-btn">Get Started</button>
          </div>
        </div>
      )}

      {/* CONTACT FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowForm(false)}>
          <div className="contact-form-container">
            <h2>How can we assist you?</h2>
            <p>For questions, bug reports, or feature requests, feel free to reach out!</p>
            <form onSubmit={handleFormSubmit}>
              <div className="input-group">
                <label>Select an Option</label>
                <select 
                  value={formData.queryType} 
                  onChange={(e) => setFormData({ ...formData, queryType: e.target.value })} 
                  required
                >
                  <option value="reportIssue">Report an Issue</option>
                  <option value="askQuestion">Ask a Question</option>
                  <option value="suggestFeature">Suggest a Feature</option>
                  <option value="shareFeedback">Share Feedback</option>
                </select>
              </div>
              <div className="input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea 
                  rows="4"
                  placeholder="Your Message" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">Submit</button>
                <button type="button" className="btn-close" onClick={handleContactClick}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowLogoutModal(false)}>
          <div className="logout-modal">
            <h3>Log out of <span className="brand-name">Paper Snap</span>?</h3>
            <p>Are you sure you want to end your session?</p>
            <div className="logout-actions">
              <button className="btn-logout-confirm" onClick={handleLogout}>Log out</button>
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;