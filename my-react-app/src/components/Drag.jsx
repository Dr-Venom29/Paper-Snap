import React, { useState } from 'react';
import './Drag.css';
import pdf from './upload.png';
import { useNavigate } from 'react-router-dom';

export default function Drag() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (data.summary) {
        navigate('/summary', { state: { summary: data.summary } });
      } else {
        alert("❌ Failed to summarize document.");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("❌ An error occurred while uploading.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsLoading(true);
      sendFileToBackend(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setIsLoading(true);
      sendFileToBackend(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="upload-container">
      <div 
        className="dropzone" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
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
            <div className="text">Analyzing PDF...</div>
          </div>
        ) : (
          <>
            <img className="pdf1" src={pdf} alt="PDF Upload Icon" />
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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14V18C21 20.2091 19.2091 22 17 22H7C4.79086 22 3 20.2091 3 18V14C3 11.7909 4.79086 10 7 10ZM12 6C10.3431 6 9 7.34315 9 9V10H15V9C15 7.34315 13.6569 6 12 6Z" fill="white"/>
              </svg>
              <span>Select PDF</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}