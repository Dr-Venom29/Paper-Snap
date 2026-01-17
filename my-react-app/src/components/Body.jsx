import React from 'react';
import './Body.css';

// --- IMPORT YOUR IMAGES HERE ---
import l1 from './i1.png';
import l2 from './i2.png';
import l3 from './i3.webp';
import l4 from './i4.png';
import r1 from './r1.png';
import r2 from './r2.png';
import r3 from './r3.png';
import r4 from './r4.png';
import r5 from './r5.png';
import r6 from './r6.png';
import r7 from './r7.png';
import r8 from './r8.webp';

export default function Body() {
  return (
    <>
      {/* SECTION 1 */}
      <div className="section-header">
        <h1>How does Paper Snap work?</h1>
      </div>

      <div className="grid-container">
        <div className="card">
          <img src={l1} alt="Upload" />
          <h1>Upload Your Document</h1>
          <p>Simply upload your research paper or any document (PDF, DOCX, etc.) using the easy drag-and-drop feature.</p>
        </div>
        <div className="card">
          <img src={l2} alt="Extract" />
          <h1>Extract Text Instantly</h1>
          <p>With a single click, PaperSnap extracts text from your document whether it’s a PDF, Word file, or any other supported format.</p>
        </div>
        <div className="card">
          <img src={l3} alt="Summarize" />
          <h1>Generate Clear Summaries</h1>
          <p>Harness the power of the RAG model to quickly summarize key points, delivering a concise and insightful summary.</p>
        </div>
        <div className="card">
          <img src={l4} alt="Download" />
          <h1>Copy & Download Effortlessly</h1>
          <p>Once the summary is generated, you can easily copy the text or download it for your convenience.</p>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="section-header" id="component2">
        <h1>Reasons to Use Paper Snap</h1>
      </div>

      <div className="grid-container">
        <div className="card">
          <img src={r1} alt="Time" />
          <h2>Save Time</h2>
          <p>Cut down on time spent reading lengthy academic papers. Quickly grasp the core ideas without reading every word.</p>
        </div>
        <div className="card">
          <img src={r2} alt="Comprehension" />
          <h2>Improve Comprehension</h2>
          <p>Our research paper summarizer breaks down complex content, making it easier to understand essential concepts.</p>
        </div>
        <div className="card">
          <img src={r3} alt="Efficiency" />
          <h2>Boost Efficiency</h2>
          <p>PaperSnap streamlines the process, helping you summarize documents efficiently and improve your workflow.</p>
        </div>
        <div className="card">
          <img src={r4} alt="Unlimited" />
          <h2>Unlimited Uploads</h2>
          <p>Upload anything from research papers to full books, without worrying about file size or page limits.</p>
        </div>
        <div className="card">
          <img src={r5} alt="Chat AI" />
          <h2>Chat with AI</h2>
          <p>Simply ask questions about your documents and get quick, accurate answers. Study more efficiently with ease.</p>
        </div>
        <div className="card">
          <img src={r6} alt="Share" />
          <h2>Save and Share Summaries</h2>
          <p>Easily save your summaries and share them, making collaboration and learning more efficient.</p>
        </div>
        <div className="card">
          <img src={r7} alt="No Signup" />
          <h2>No Signup Needed</h2>
          <p>Skip the signup and start summarizing and taking notes instantly. No forms, no logins, just quick and easy.</p>
        </div>
        <div className="card">
          <img src={r8} alt="Translate" />
          <h2>Translate Effortlessly</h2>
          <p>Simply select your preferred language and receive a fast, accurate translation in seconds.</p>
        </div>
      </div>
    </>
  );
}