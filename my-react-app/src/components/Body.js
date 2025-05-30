import React from 'react';
import './Body.css'
import l1 from './i1.png';
import l2 from './i2.png';
import l3 from './i3.webp';
import l4 from './i4.png'
import r1 from './r1.png';
import r2 from './r2.png';
import r3 from './r3.png';
import r4 from './r4.png';
import r5 from './r5.png';
import r6 from './r6.png';
import r7 from './r7.png';
import r8 from './r8.webp'

export default function Body() {
  return (
    <>
    <div className="body1">
        <h1>How does Paper Snap work?</h1>
    </div>
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <img src={l1} alt="/"/>
          <h1>Upload Your Document</h1>
          <p>Simply upload your research paper or any document (PDF, DOCX, etc.) using the easy drag-and-drop feature.</p>
        </div>
        <div className="col">
          <img src={l2} alt="/"/>
          <h1>Extract Text Instantly</h1>
          <p>With a single click, PaperSnap extracts text from your document whether it’s a PDF, Word file, or any other supported format.</p>
        </div>
        <div className="col">
          <img src={l3} alt="/"/>
          <h1> Generate Clear, Concise Summaries</h1>
          <p>Harness the power of the RAG model to quickly summarize key points, delivering a concise and insightful summary of your research paper.</p>
        </div>
        <div className="col">
          <img src={l4} alt="/"/>
          <h1>Copy & Download Effortlessly</h1>
          <p>Once the summary is generated, you can easily copy the text or download it for your convenience.</p>
        </div>
      </div>
    </div>
    <div className="body1" id="component2">
      <h1>Reasons to Use Paper Snap</h1>
    </div>
    <div className="container text-center">
      <div id="reason" className="row">
        <div className="col">
        <img src={r1} alt="/"/>
        <h2>Save Time</h2>
        <p>With PaperSnap's research paper summarizer, you can cut down on the time spent reading lengthy academic papers. Quickly grasp the core ideas without reading every word of the original document.</p>
        </div>
        <div className="col">
        <img src={r2} alt="/"/>
        <h2>Improve comprehension</h2>
        <p>Our research paper summarizer breaks down complex content, making it easier to understand essential concepts, key findings, and critical insights from any research paper.</p>
        </div>
        <div className="col">
        <img src={r3} alt="/"/>
        <h2>Boost Efficiency</h2>
        <p>Reading multiple research papers takes time. PaperSnap streamlines the process, helping you summarize documents efficiently and improve your overall research workflow.</p>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div id="reason" class="row">
        <div class="col">
        <img src={r4} alt="/"/>
        <h2>Unlimited Uploads and Summaries</h2>
        <p>Upload anything from research papers to full books, without worrying about file size or page limits. Enjoy unlimited summaries with no restrictions on usage.</p>
        </div>
        <div class="col">
        <img src={r5} alt="/"/>
        <h2>Chat with AI on Your PDF's</h2>
        <p>Simply ask questions about your documents and get quick, accurate answers. Study more efficiently and find the information you need with ease.</p>
        </div>
        <div class="col">
        <img src={r6} alt="/"/>
        <h2>Save and Share Summaries</h2>
        <p>Easily save your summaries and share them, making collaboration and learning more efficient.</p>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div id="reason" class="row">
        <div class="col">
        <img src={r7} alt="/"/>
        <h2>No Signup Needed</h2>
        <p>Skip the signup and start summarizing and taking notes instantly. No forms, no logins, just quick and easy.</p>
        </div>
        <div class="col">
        <img src={r8} alt="/"/>
        <h2>Translate your summary effortlessly</h2>
        <p>Simply select your preferred language and receive a fast, accurate translation in seconds. No hassle, just seamless results.</p>
        </div>
        <div class="col">
        <img src={r6} alt="/"/>
        <h2>Save and Share Summaries</h2>
        <p>Easily save your summaries and share them, making collaboration and learning more efficient.</p>
        </div>
      </div>
    </div>
    </>
  );
}