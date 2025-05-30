import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- added useLocation
import logo from './web-logo.png';
import profile from './profile.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- get current path
  const [showForm, setShowForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    queryType: '',
    email: '',
    message: '',
  });

  const handleClick = () => {
    navigate('/login');
  };

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
    e.preventDefault(); // Prevent default anchor behavior
    document.getElementById('component2').scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const isSummaryPage = location.pathname === '/summary'; // <-- hide block on summary page

  return (
    <>
      <div className="ab">
        <div>
          <img className="logo" src={logo} alt="/" height="95" width="80" />
        </div>
        <pre className="abc">
          <h1>
            &bull; <Link to="/about">About</Link>   &bull; <Link to="/" onClick={scrollToComponent2}>Features</Link>   &bull; <Link to="/contact" onClick={handleContactClick}>Contact Us</Link>{'  '}
            {
              localStorage.getItem('token') ? (
                <img
                  src={profile}
                  alt="Profile"
                  className="profile-icon"
                  onClick={handleProfileClick}
                  style={{
                    width: '35px',
                    height: '35px',
                    verticalAlign: 'middle',
                    marginLeft: '10px',
                    marginRight:'10px',
                    marginBottom:'10px',
                    cursor: 'pointer',
                  }}
                />
              ) : (
              <button onClick={handleClick} className="button">Login</button>
              )
            }
          </h1>
        </pre>
      </div><br />

      {/* Only render this section if not on summary page */}
      {!isSummaryPage && (
        <div className="abc">
          <h2>
            <b>
              <span className="snap">Paper Snap</span>
              <span className="snap1">:</span> Turn Any Research Paper Into Clear Summary
            </b>
          </h2>
          <p className="p">
            It is a free tool that quickly turns your research papers into clear, concise summaries. Leverage the power of<br />
            the RAG model to summarize documents effortlessly and gain relevant insights in no time.
          </p>
          <input placeholder="Your Email address" className="input1" name="text" type="email" />
          <button type="submit" className="btn1">Get Started</button>
        </div>
      )}

      {/* Contact Form Modal */}
      {showForm && (
        <div className="contact-form-overlay">
          <div className="contact-form-container">
            <h2><b>How can we assist you?</b></h2>
            <p>For questions, bug reports, or feature requests, feel free to reach out!</p>
            <form onSubmit={handleFormSubmit}>
              <div className="input-group">
                <label htmlFor="queryType">Select an Option</label>
                <select id="queryType" name="queryType" value={formData.queryType} onChange={(e) => setFormData({ ...formData, queryType: e.target.value })} required>
                  <option value="reportIssue">Report an Issue</option>
                  <option value="askQuestion">Ask a Question</option>
                  <option value="suggestFeature">Suggest a Feature</option>
                  <option value="shareFeedback">Share Feedback</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required></textarea>
              </div>
              <div className="button-container">
                <button type="submit" className="submit-btn">Submit <svg fill="white" viewBox="0 0 448 512" height="1em" className="arrow"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path></svg>
                </button>
                <button className="close-form" onClick={handleContactClick}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <h3>Log out of <span className="brand-name">Paper Snap</span>?</h3>
            <p>Are you sure you want to end your session?</p>
            <div className="modal-buttons">
              <button className="logout-btn" onClick={handleLogout}>Log out</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
