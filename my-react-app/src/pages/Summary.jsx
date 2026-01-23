import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../components/Footer';
import './Summary.css';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const originalSummary = location.state?.summary || "No summary available.";
  const file_id = location.state?.file_id;

  const [translatedSummary, setTranslatedSummary] = useState('');
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState('txt');
  const [filename, setFilename] = useState('');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');

  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTranslateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerDownload = () => {
    const safeFilename = filename.trim() || 'summary';
    const contentToDownload = translatedSummary || originalSummary;

    if (fileType === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(contentToDownload, 180);
      doc.text(lines, 10, 10);
      doc.save(`${safeFilename}.pdf`);
    } else if (fileType === 'docx') {
      const doc = new Document({
        sections: [{ children: [new Paragraph({ children: [new TextRun(contentToDownload)] })] }],
      });
      Packer.toBlob(doc).then((blob) => saveAs(blob, `${safeFilename}.docx`));
    } else {
      const file = new Blob([contentToDownload], { type: 'text/plain' });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(file);
      element.download = `${safeFilename}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    setShowModal(false);
  };

  const handleDownloadClick = () => {
    if (!token) {
      alert('Please log in to download the summary.');
      navigate('/login', { state: { from: '/summary', summary: originalSummary } });
      return;
    }
    setShowModal(true);
  };

  const handleTranslateClick = (e) => {
    e.stopPropagation(); // Prevent immediate closing due to document click listener
    if (!token) {
      alert('Please log in to translate the summary.');
      navigate('/login', { state: { from: '/summary', summary: originalSummary } });
      return;
    }
    setShowTranslateDropdown((prev) => !prev);
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleLanguageSelect = async (targetLang) => {
    setShowTranslateDropdown(false);
    try {
      setLoadingTranslate(true);
      await delay(1000); // Fake delay
      const res = await axios.post('http://localhost:8000/translate', {
        text: originalSummary,
        targetLang: targetLang
      });
      setTranslatedSummary(res.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate summary. Try again later.');
    } finally {
      setLoadingTranslate(false);
    }
  };

  const sendMessageToChatbot = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, file_id }),
      });
      if (!response.ok) throw new Error("Failed to fetch chatbot response");
      return await response.json();
    } catch (error) {
      console.error("Error contacting chatbot:", error);
      return { response: "Sorry, something went wrong." };
    }
  };

  const handleQuestionSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!token) {
      alert('Please log in to chat with Snap Bot.');
      navigate('/login', { state: { from: '/summary', summary: originalSummary } });
      return;
    }
    if (!question.trim()) return;
    
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setQuestion("");
    const data = await sendMessageToChatbot(question);
    
    const botMessage = { sender: "bot", text: data.response || "No response." };
    if (data.image_url) botMessage.image = data.image_url;
    
    setMessages((prev) => [...prev, botMessage]);
  };

  function stripImageUrls(text = '') {
    return text.replace(/https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)/gi, '').trim();
  }

  return (
    <div className="summary-page">
      {/* Background Glow Orbs */}
      <div className="glow-orb glow-1"></div>
      <div className="glow-orb glow-2"></div>

      <Navbar />
      
      <div className="content-container">
        {/* Left Column: Summary Card */}
        <div className="summary-card glass-card">
          <div className="card-header">
            <h2>Document Summary</h2>
          </div>
          
          <div className="summary-content">
            {loadingTranslate ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Translating...</p>
              </div>
            ) : (
              <p>{translatedSummary || originalSummary}</p>
            )}
          </div>

          <div className="action-bar">
            <button className="btn-primary" onClick={handleDownloadClick}>
              <i className="fas fa-download"></i> Download
            </button>
            <div className="translate-wrapper" ref={dropdownRef}>
              <button className="btn-secondary" onClick={handleTranslateClick}>
                <i className="fas fa-globe"></i> Translate
              </button>
              
              {showTranslateDropdown && (
                <div className="dropdown-menu">
                  {['Telugu', 'Hindi', 'Sanskrit', 'Kannada', 'Malayalam', 'Tamil', 'French', 'Spanish', 'Russian', 'English'].map((lang) => (
                    <button key={lang} onClick={() => handleLanguageSelect(lang)}>
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chatbot */}
        <div className="chatbot-card glass-card">
          <div className="card-header">
            <h2>Snap Bot</h2>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 && (
          <div className="chat-bubble bot-msg">
            <p>How can I help you with this summary?</p>
          </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {(!msg.image || (msg.text && stripImageUrls(msg.text))) && (
                  <p>{stripImageUrls(msg.text)}</p>
                )}
                {msg.image && <img src={msg.image} alt="bot content" />}
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleQuestionSubmit}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="chat-input"
            />
            <button type="submit" className="send-btn" aria-label="Send message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="send-icon"
              aria-hidden="true"
            >
              <path
                d="M4.5 19.5L19.5 12 4.5 4.5 4.5 10.5 13.5 12 4.5 13.5z"
                fill="currentColor"
              />
            </svg>
          </button>
          </form>
        </div>
      </div>

      <Footer />

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h3>Download Summary</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Filename (optional)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <select className="modal-select" value={fileType} onChange={(e) => setFileType(e.target.value)}>
              <option value="txt">Text File (.txt)</option>
              <option value="pdf">PDF Document (.pdf)</option>
              <option value="docx">Word Document (.docx)</option>
            </select>
            <div className="modal-actions">
              <button onClick={triggerDownload} className="btn-primary">Download</button>
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;