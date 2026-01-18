import React from 'react';
import Navbar from '../Navbar'; // Ensure this path matches your project structure
import Footer from '../components/Footer'; // Ensure this path matches your project structure
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">

      <Navbar />
      
      <div className="content-wrapper">
        <div className="policy-card glass-card">
          
          <header className="policy-header">
            <h1>Privacy Policy</h1>
            <p className="effective-date">Effective Date: April 6, 2025</p>
          </header>

          <section className="policy-section">
            <p className="intro-text">
              Welcome to <span className="brand-highlight">Paper Snap</span> – where we turn cluttered academic documents into concise, intelligent summaries. Your trust means everything to us, and that begins with transparency about how we handle your information.
            </p>
            <p className="policy-text">
              This Privacy Policy ("Policy") explains how Paper Snap collects, uses, and protects your information when you visit our website or interact with any services that link to this Policy (collectively referred to as the "Site"). By using our Site, you agree to the practices described here. If you disagree, we kindly ask you not to use the Site.
            </p>
          </section>

          <section className="policy-section">
            <h2>What We Collect</h2>
            <p className="policy-text">
              We collect information to provide you with a smooth, secure, and personalized experience. This may include:
            </p>
            <ul className="policy-list">
              <li><span className="bullet-icon">•</span> <strong>Contact Details:</strong> Such as your name, email address, or other info you provide when signing up or contacting us.</li>
              <li><span className="bullet-icon">•</span> <strong>Device & Technical Info:</strong> Including your IP address, browser type, operating system, and device type.</li>
              <li><span className="bullet-icon">•</span> <strong>Usage Data:</strong> Such as the pages you visit, actions you take, and the time you spend with us.</li>
              <li><span className="bullet-icon">•</span> <strong>Uploaded Files:</strong> Your uploaded documents (like PDFs) are processed securely and automatically deleted after processing.</li>
              <li><span className="bullet-icon">•</span> <strong>Cookies & Trackers:</strong> We may use cookies and analytics tools to understand usage patterns and enhance user experience.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>How We Use Your Information</h2>
            <p className="policy-text">We use the collected data to:</p>
            <ul className="policy-list">
              <li><span className="bullet-icon">•</span> Deliver, improve, and maintain our summarization services.</li>
              <li><span className="bullet-icon">•</span> Personalize your experience and remember your preferences.</li>
              <li><span className="bullet-icon">•</span> Communicate updates, respond to your inquiries, and support your account.</li>
              <li><span className="bullet-icon">•</span> Analyze trends and usage to keep improving.</li>
              <li><span className="bullet-icon">•</span> Detect, prevent, and address misuse or fraud.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Sharing Information</h2>
            <p className="policy-text">We do not sell your personal data. However, we may share information under the following conditions:</p>
            <ul className="policy-list">
              <li><span className="bullet-icon">•</span> <strong>Service Providers:</strong> We may work with trusted vendors who help operate our platform (e.g., hosting, analytics).</li>
              <li><span className="bullet-icon">•</span> <strong>Legal Compliance:</strong> When required by law or legal process.</li>
              <li><span className="bullet-icon">•</span> <strong>Protection:</strong> To safeguard the rights, safety, and property of Paper Snap, our users, or others.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Your Choices</h2>
            <p className="policy-text">You have control over your data:</p>
            <ul className="policy-list">
              <li><span className="bullet-icon">•</span> <strong>Cookie Preferences:</strong> You can disable cookies in your browser, but this may affect some features.</li>
              <li><span className="bullet-icon">•</span> <strong>Communication Settings:</strong> You can unsubscribe from non-essential emails using the link in our messages.</li>
              <li><span className="bullet-icon">•</span> <strong>Account Access:</strong> You can update or correct your information through your account dashboard.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Data Retention & Security</h2>
            <p className="policy-text">
              We retain data only as long as needed to provide services or meet legal obligations. We apply industry-standard security practices, including encryption and secure data deletion. However, please remember that no system is completely immune to breaches.
            </p>
          </section>

          <section className="policy-section">
            <h2>Policy Updates</h2>
            <p className="policy-text">
              We may revise this Policy occasionally to reflect improvements or legal requirements. When we do, we’ll update the “Effective Date” above and notify you when necessary. Continued use of the Site means you accept those changes.
            </p>
          </section>

          <section className="policy-section contact-section">
            <h2>Contact Us</h2>
            <p className="policy-text">Got questions or concerns? We’d love to hear from you.</p>
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

export default PrivacyPolicy;