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

  const [translatedSummary, setTranslatedSummary] = useState('');
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);  // For translation loading spinner
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState('txt');
  const [filename, setFilename] = useState('');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');

  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null); // Reference to the dropdown

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTranslateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun(contentToDownload)],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${safeFilename}.docx`);
      });
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

  const handleTranslateClick = () => {
    if (!token) {
      alert('Please log in to translate the summary.');
      navigate('/login', { state: { from: '/summary', summary: originalSummary } });
      return;
    }
    setShowTranslateDropdown(!showTranslateDropdown);
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleLanguageSelect = async (targetLang) => {
    setShowTranslateDropdown(false); // 👈 Close immediately
    try {
      setLoadingTranslate(true);  // Start spinner for translation
      await delay(1900); // Fake delay
      const res = await axios.post('http://localhost:5001/translate', {
        text: originalSummary,
        targetLang: targetLang
      });
    
      setTranslatedSummary(res.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate summary. Try again later.');
    } finally {
      setLoadingTranslate(false); // Stop spinner for translation
    }
  };

  const sendMessageToChatbot = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
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
    return;}
    if (!question.trim()) return;
    
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setQuestion("");
    const data = await sendMessageToChatbot(question);
    
    // Conditionally include the image in the message
    const botMessage = { sender: "bot", text: data.response || "No response." };
    if (data.image_url) {
      botMessage.image = data.image_url;
    }
    
    setMessages((prev) => [...prev, botMessage]);
  };

  // Removes all URLs from the text (handles png, jpg, jpeg, gif, webp, etc.)
  function stripImageUrls(text = '') {
    return text.replace(/https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)/gi, '').trim();}
  
  return (
    <>
      <Navbar />
      <div className="summary-wrapper">
        <div className="summary-card">
          <h2 className="summary-title">📄 Summary</h2>
          <div className="summary-text">
            {loadingTranslate ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <p>{translatedSummary || originalSummary}</p>
            )}
          </div>
          <div className="download-section">
            <button className="download" onClick={handleDownloadClick}>
              <svg
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                height="40"
                width="40"
                className="button__icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                <path d="M7 11l5 5l5 -5"></path>
                <path d="M12 4l0 12"></path>
              </svg>
              <span className="button__text">Download</span>
            </button>

            {/* Translate Button */}
            <button className="translate" onClick={handleTranslateClick} style={{ marginLeft: '10px' }}>
              🌍 Translate
            </button>

            {/* Language Dropdown */}
            {showTranslateDropdown && (
              <div className="translate-dropdown" ref={dropdownRef}>
                <button onClick={() => handleLanguageSelect('te')}>Telugu</button>
                <button onClick={() => handleLanguageSelect('hi')}>Hindi</button>
                <button onClick={() => handleLanguageSelect('sa')}>Sanskrit</button>
                <button onClick={() => handleLanguageSelect('kn')}>Kannada</button>
                <button onClick={() => handleLanguageSelect('ml')}>Malayalam</button>
                <button onClick={() => handleLanguageSelect('ta')}>Tamil</button>
                <button onClick={() => handleLanguageSelect('fr')}>French</button>
                <button onClick={() => handleLanguageSelect('es')}>Spanish</button>
                <button onClick={() => handleLanguageSelect('ru')}>Russian</button>
                <button onClick={() => handleLanguageSelect('en')}>Back to English</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="chatbot-section">
        <h3>Chat with Snap Bot</h3>
        <div className="chatbox">
          <div className="messages">
            {/* Default first bot message */}
            {messages.length === 0 && (
              <div className="message bot-message">
                <p>How could I assist you today?</p>
              </div>
            )}

            {/* Show all chat messages */}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {(!msg.image || (msg.text && stripImageUrls(msg.text))) && (
                  <p>{stripImageUrls(msg.text)}</p>)}
                {msg.image && <img src={msg.image} alt="bot related" />}
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="chat-footer">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about the summary..."
              className="chat-input"
            />
            <button
              onClick={handleQuestionSubmit}
              disabled={false}  // No loading state for chat
              className="submit-chat-btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <Footer />
      {/* Download Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="download-modal">
            <h3>Choose Download Format</h3>
            <input
              type="text"
              className="filename-input"
              placeholder="Enter filename..."
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <select
              className="file-type-select"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="txt">Text (.txt)</option>
              <option value="pdf">PDF (.pdf)</option>
              <option value="docx">Word (.docx)</option>
            </select>

            <div className="modal-buttonss">
              <button onClick={triggerDownload} className="cancel-btn">Download</button>
              <button onClick={() => setShowModal(false)} className="logout-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
