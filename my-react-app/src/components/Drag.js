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
        navigate('/summary', { state: { summary: data.summary } }); // Redirect with summary
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
      <div className="dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
        {isLoading ? (
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-title">Status</div>
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
            </div>
            <div className="text">Processing...</div>
          </div>
        ) : (
          <>
            <img className="pdf1" src={pdf} alt="PDF Icon" />
            <p>Click to upload, or drag and drop your file here.</p>
          </>
        )}

        <input
          type="file"
          accept=".pdf"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {!isLoading && (
          <button className="cssbuttons-io-button" onClick={() => document.getElementById('fileInput').click()}>
            <svg viewBox="0 0 640 512" fill="white" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1
                c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0
                96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128
                128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24
                24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9
                0l-80 80z">
              </path>
            </svg>
            <span> Upload</span>
          </button>
        )}
      </div>
    </div>
  );
}
