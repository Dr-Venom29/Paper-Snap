from flask import Flask, request, jsonify
from flask_cors import CORS
from ingestion import process_pdf
from storage import sync_to_supabase
from generation import get_rag_chain
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

vector_store = None

@app.route('/upload', methods=['POST'])
def upload():
    global vector_store
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    os.makedirs("./uploads", exist_ok=True)
    file_path = f"./uploads/{file.filename}"
    file.save(file_path)
    
    try:
        # 1. AI-Powered Ingestion
        chunks = process_pdf(file_path)
        
        # FIX: Check if chunks is empty before proceeding
        if not chunks:
            return jsonify({
                "error": "The PDF was processed but no text sections were found. Please try a different paper."
            }), 422
        
        # 2. Cloud Vector Storage
        vector_store = sync_to_supabase(chunks)
        
        # 3. Quick Summary Generation
        # FIX: Added a check for the length of chunks to prevent list index out of range
        llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
        
        # Safely slice the list even if it has fewer than 3 chunks
        sample_chunks = chunks[:min(len(chunks), 3)]
        combined_text = " ".join([c.page_content for c in sample_chunks])
        
        summary_prompt = f"Provide a concise professional summary of this document: {combined_text[:3000]}"
        summary_result = llm.invoke(summary_prompt)
        
        return jsonify({
            "status": "Success", 
            "summary": summary_result.content
        })
        
    except Exception as e:
        print(f"Error during upload/processing: {e}")
        return jsonify({"error": f"Internal processing error: {str(e)}"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    global vector_store
    if vector_store is None:
        return jsonify({"error": "No document uploaded yet"}), 400

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        chain = get_rag_chain(vector_store)
        response = chain.invoke(data['message'])
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error during chat: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)