import React, { useState } from 'react';
import './Drag.css';
import pdfIcon from './upload.png'; // Renamed to avoid confusion with PDF type
import { useNavigate } from 'react-router-dom';

export default function Drag() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Ensure backend is running on port 8000
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
        // Removed credentials if not using specific session cookies to simplify
      });

      const data = await response.json();

      if (response.ok && data.summary) {
        // Successful navigation to Summary page
        navigate('/summary', { state: { summary: data.summary, file_id: data.file_id } });
      } else {
        const errorMsg = data.error || "Failed to summarize document.";
        alert(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert("❌ Server is offline. Please run main.py first.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      sendFileToBackend(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setIsLoading(true);
      sendFileToBackend(file);
    } else {
      alert("Please drop a valid PDF file.");
    }
  };

  return (
    <div className="upload-container">
      <div 
        className="dropzone" 
        onDrop={handleDrop} 
        onDragOver={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
              <div className="terminal-title">Processing</div>
            </div>
            <div className="text">Analyzing Paper...</div>
          </div>
        ) : (
          <>
            <img className="pdf1" src={pdfIcon} alt="Upload" />
            <p>Drag & drop your research paper here, or click to browse.</p>
            <input
              type="file"
              accept=".pdf"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button 
              className="cssbuttons-io-button" 
              onClick={() => document.getElementById('fileInput').click()}
            >
              <span>Select PDF</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}