import React from 'react';
import Navbar from '../Navbar'; // Ensure this path matches your project structure
import Footer from '../components/Footer'; // Ensure this path matches your project structure
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-page">

      <Navbar />
      
      <div className="content-wrapper">
        <div className="terms-card glass-card">
          
          <header className="policy-header">
            <h1>Terms of Service</h1>
            <p className="effective-date">Effective Date: April 6, 2025</p>
          </header>

          <section className="policy-section">
            <div className="intro-text">
              Welcome to <span className="brand-highlight">Paper Snap</span> – where research meets simplicity. By accessing or using our platform, you agree to the terms outlined below. Please read them carefully. If you don’t agree with these terms, we kindly ask that you refrain from using our services.
            </div>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2>What We Offer</h2>
            </div>
            <p className="policy-text">
              Paper Snap is an AI-powered research paper summarization platform designed to make academic content more digestible. By uploading a PDF, users can get quick summaries, key points, and even ask questions – all within a few clicks.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2>Who Can Use Paper Snap</h2>
            </div>
            <p className="policy-text">
              You must be at least 13 years old to use our services. If you're using Paper Snap on behalf of an organization or institution, you confirm that you have the authority to agree to these Terms on its behalf.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2>User Accounts & Security</h2>
            </div>
            <p className="policy-text">
              You may be required to register for an account. You're responsible for safeguarding your login credentials. Please keep your password safe and notify us immediately if you suspect unauthorized use.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2>Acceptable Use Policy</h2>
            </div>
            <p className="policy-text">We want Paper Snap to be a helpful and safe space. You agree not to:</p>
            <ul className="policy-list">
              <li><span className="bullet-icon">•</span> Upload content that’s illegal, harmful, or abusive.</li>
              <li><span className="bullet-icon">•</span> Infringe on intellectual property rights.</li>
              <li><span className="bullet-icon">•</span> Attempt to disrupt our services or security.</li>
              <li><span className="bullet-icon">•</span> Use automated tools to scrape or overload the system.</li>
            </ul>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2>Ownership & Intellectual Property</h2>
            </div>
            <p className="policy-text">
              All content, branding, code, and features on Paper Snap belong to us or our licensors. You may use the platform, but copying, modifying, or redistributing any part of it without our consent is not allowed.
            </p>
            <p className="policy-text">
              Your uploaded files remain yours — we do not claim ownership of your documents. We only use them to provide the service you’ve requested, and they’re not shared with anyone else.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">06</span>
              <h2>Privacy Matters</h2>
            </div>
            <p className="policy-text">
              We take your privacy seriously. Read our <a href="/privacy-policy" className="link-highlight">Privacy Policy</a> to understand how we handle your data, what’s collected, and your rights as a user.
            </p>
          </section>

          <section className="policy-section disclaimer-section">
            <div className="section-header">
              <span className="section-number">07</span>
              <h2>Disclaimers & Limitations</h2>
            </div>
            <p className="policy-text">
              Paper Snap provides summaries and insights based on AI-generated analysis. While we strive for accuracy, the information is not guaranteed to be 100% error-free or academically sufficient. Use it as a helpful aid — not a substitute for original research.
            </p>
            <p className="policy-text">
              We are not liable for any damages arising from your use of the platform.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">08</span>
              <h2>Termination</h2>
            </div>
            <p className="policy-text">
              We reserve the right to suspend or terminate your access if you breach these terms or misuse the service. No hard feelings — but rules keep things fair.
            </p>
          </section>

          <section className="policy-section">
            <div className="section-header">
              <span className="section-number">09</span>
              <h2>Changes to These Terms</h2>
            </div>
            <p className="policy-text">
              We may update these Terms from time to time. Any changes will be posted here with a revised "Effective Date." Continued use of the site means you accept the updated terms.
            </p>
          </section>

          <section className="policy-section contact-section">
            <div className="section-header">
              <span className="section-number">10</span>
              <h2>Contact Us</h2>
            </div>
            <p className="policy-text">Still have questions? We’re here to help.</p>
            <div className="contact-box">
              <i className="fas fa-envelope"></i>
              <span>support@paper-snap.com</span>
            </div>
          </section>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;