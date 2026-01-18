import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import instagram from './insta.png';
import x from './X.webp';
import facebook from './fb.jpg';
import linkedin from './in.webp';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-left">
            <h2 className="footer-logo">Paper Snap</h2>
            <p className="footer-tagline">Where long research papers meet short, smart summaries.</p>
          </div>

          <div className="social-links">
            <a href="https://instagram.com/paper_snap" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="https://x.com/PaperSnap25" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <img src={x} alt="X (Twitter)" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="https://linkedin.com/in/paper-snap-bbbb1935b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={linkedin} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>© Paper Snap 2026. All rights reserved.</p>
          
          <div className="footer-links">
    <Link to="/privacy-policy">Privacy Policy</Link>
      <Link to="/terms-of-service">Terms of Service</Link>
      <Link to="mailto:support@pdf-summarizer.com">Contact Us</Link>
          </div>

          <p className="developer-credit">Developed by: Paper Snap Team</p>
        </div>

      </div>
    </footer>
  );
}