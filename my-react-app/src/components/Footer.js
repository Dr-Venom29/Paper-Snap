import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import privacy from './Paper-Snap-pp.pdf';
import terms from './Terms-of-Service.pdf';
import instagram from './insta.png';
import x from './X.webp';
import facebook from './fb.jpg';
import linkedin from './in.webp';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-row">
        <div className="footer-left">
          <h2 className="footer-logo">📄Paper Snap</h2>
          <p className="footer-tagline">Where long research papers meet short, smart summaries.</p>
        </div>

        <div className="footer-images">
          <a href="https://instagram.com/paper_snap" target="_blank" rel="noopener noreferrer">
            <img src={instagram} className="twit" alt="Instagram" />
          </a>
          <a href="https://x.com/PaperSnap25" target="_blank" rel="noopener noreferrer">
            <img src={x} className="twit" alt="X (Twitter)" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook} className="fb" alt="Facebook" />
          </a>
          <a href="https://linkedin.com/in/paper-snap-bbbb1935b" target="_blank" rel="noopener noreferrer">
            <img src={linkedin} className="fb" alt="LinkedIn" />
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <p className="footer-bottom-text">
        © Paper Snap 2025. All rights reserved.
        <span className="footer-links">
          <a href={privacy}>Privacy Policy</a> |
          <a href={terms}>Terms of Service</a> |
          <Link to="mailto:support@pdf-summarizer.com">Contact Us: support@paper-snap.com</Link>
        </span>
        Developed by: Paper Snap Team
      </p>
    </footer>
  );
}
