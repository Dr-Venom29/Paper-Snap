# Paper Snap 

**Paper Snap** is a state-of-the-art research paper analysis platform designed to democratize access to academic knowledge. By leveraging the power of **Retrieval-Augmented Generation (RAG)** and high-performance Large Language Models (LLMs), it transforms dense, complex academic PDFs into clear, actionable insights.

Whether you are a researcher, student, or curious learner, Paper Snap helps you understand papers faster by providing high-fidelity summaries and an interactive Q&A assistant that answers questions based strictly on the source text—eliminating hallucinations.

## Why Paper Snap?

Reading research papers is often time-consuming and cognitively demanding. Paper Snap solves this by:
1.  **Breaking Down Complexity**: Automatically extracting and summarizing core sections like Abstract, Methodology, Results, and Conclusions.
2.  **Ensuring Accuracy**: Using a specialized RAG pipeline with **Cohere Reranking** to ensure that answers are grounded in the most legally relevant parts of the document.
3.  **Speed**: Utilizing **Groq's LPU™ Inference Engine** to deliver near-instant summaries and answers, even for long papers (using `llama-3.3-70b-versatile`).

##  Key Features

###  Advanced RAG Pipeline
*   **Smart Ingestion**: Uses `PyPDFLoader` and specialized parsing logic to segment papers into meaningful semantic chunks.
*   **Hybrid Search**: Combines **Supabase's pgvector** for semantic search with **Cohere's Rerank v3.0** model to prioritize the most accurate context chunks before sending them to the LLM.
*   **Contextual Awareness**: Filters knowledge bases by `file_id`, ensuring the AI only calls upon the specific paper you are currently analyzing.

###  Intelligent Summarization
*   **Targeted Extraction**: Specifically isolates critical sections (Abstract, Methodology, Results, Conclusion) to generate a summary that matters.
*   **Large Context Processing**: Capable of processing vast amounts of text to generate a cohesive overview without "tunnel vision."

###  Performance-First Architecture
*   **Groq Inference**: Powered by the `llama-3.3-70b-versatile` model running on Groq hardware for blazing-fast response times.
*   **Cohere Embeddings**: Uses `embed-english-v3.0` for industry-leading semantic understanding of academic text.
*   **Supabase Vector Store**: Scalable and secure storage for document embeddings.

##  Tech Stack

### Frontend
- **React.js**: Component-based UI library.
- **React Router**: For seamless navigation.
- **CSS3**: Custom responsive styling.
- **Supabase Client**: For authentication and data interactions.

### Backend
- **Python & Flask**: robust API server.
- **LangChain**: Framework for building LLM applications.
- **Cohere**: High-quality text embeddings (`embed-english-v3.0`).
- **Groq**: Ultra-fast LLM inference engine.
- **LangExtract**: For specialized unstructured data extraction.

### Database & Storage
- **Supabase**: PostgreSQL database with `pgvector` extension for vector storage and file management.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js & npm
- Python 3.8+
- Supabase Account
- API Keys for: **Groq**, **Cohere**, **Supabase**, and **LangExtract**.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/paper-snap.git
cd paper-snap
```

### 2. Backend Setup
Navigate to the backend directory and set up the environment.

```bash
cd rag-backend
# Optional: Create a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies (ensure you have a requirements.txt, otherwise install manually)
pip install flask flask-cors langchain langchain-groq langchain-cohere langchain-community supabase python-dotenv langextract
```

**Configure Environment Variables:**
Create a `.env` file in the `rag-backend` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
COHERE_API_KEY=your_cohere_api_key
GROQ_API_KEY=your_groq_api_key
LANGEXTRACT_API_KEY=your_langextract_api_key
```

**Run the Backend:**
```bash
python main.py
```
*The server typically runs on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory.

```bash
cd my-react-app

# Install dependencies
npm install

# Run the development server
npm start
```
*The application should now be running on `http://localhost:3000`.*

##  Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Dr-Venom29">
        <img src="https://github.com/Dr-Venom29.png" width="100px;" alt=""/>
        <br />
        <sub><b>Dr-Venom29</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SriharshaG05">
        <img src="https://github.com/SriharshaG05.png" width="100px;" alt=""/>
        <br />
        <sub><b>SriharshaG05</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/vislavathmahesh">
        <img src="https://github.com/vislavathmahesh.png" width="100px;" alt=""/>
        <br />
        <sub><b>vislavathmahesh</b></sub>
      </a>
    </td>
  </tr>
</table>
