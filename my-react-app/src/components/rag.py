import fitz  # PyMuPDF (for handling PDFs)
import faiss  # FAISS for vector search
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Load Models
retriever_model = SentenceTransformer("all-MiniLM-L6-v2")  # Vector embeddings
tokenizer = T5Tokenizer.from_pretrained("t5-small")
generator_model = T5ForConditionalGeneration.from_pretrained("t5-small")

# Initialize FAISS index with Inner Product (better for cosine similarity)
embedding_dim = 384
index = faiss.IndexFlatIP(embedding_dim)
text_chunks = []  # Store text separately

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file, handling errors."""
    try:
        doc = fitz.open(pdf_path)
        chunks = [page.get_text("text").strip() for page in doc if page.get_text("text").strip()]
        doc.close()
        return chunks
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return []

def store_embeddings(chunks):
    """Stores normalized embeddings in FAISS index."""
    global text_chunks  
    if not chunks:
        print("No text extracted from PDF.")
        return
    
    text_chunks.extend(chunks)
    embeddings = retriever_model.encode(chunks, convert_to_tensor=False)
    
    # Normalize embeddings for cosine similarity search
    embeddings = np.array(embeddings, dtype=np.float32)
    faiss.normalize_L2(embeddings)
    
    index.add(embeddings)
    print(f"Stored {len(chunks)} text chunks.")

def chunk_text(text, chunk_size=200):
    """Splits long text into smaller chunks for better summarization."""
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def generate_summary(text):
    """Generates a summary using T5 model with chunking for long text."""
    text_chunks = chunk_text(text)  
    summaries = []
    
    for chunk in text_chunks:
        inputs = tokenizer("summarize: " + chunk, return_tensors="pt", max_length=512, truncation=True)
        summary_ids = generator_model.generate(inputs["input_ids"], max_length=150, num_beams=4, early_stopping=True)
        summaries.append(tokenizer.decode(summary_ids[0], skip_special_tokens=True))

    return " ".join(summaries)

# Step 1: Extract text and store embeddings
pdf_path = "D:/Kmit/Sdc/project/files/MIT-COD.pdf"
pdf_text_chunks = extract_text_from_pdf(pdf_path)
store_embeddings(pdf_text_chunks)

# Step 2: Summarize the entire text (no query required)
full_text = " ".join(pdf_text_chunks)  # Combine all text chunks into one large string
final_summary = generate_summary(full_text)

print("Final Summary:\n", final_summary)