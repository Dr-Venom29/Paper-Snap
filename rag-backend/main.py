from flask import Flask, request, jsonify
from flask_cors import CORS
from ingestion import process_pdf
from storage import sync_to_supabase, get_vector_store
from generation import get_rag_chain, generate_summary
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import uuid

load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.route('/upload', methods=['POST'])
def upload():
    # Remove global vector_store usage
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    os.makedirs("./uploads", exist_ok=True)
    file_path = f"./uploads/{file.filename}"
    file.save(file_path)
    
    try:
        # Generate unique file_id
        file_id = str(uuid.uuid4())

        # 1. AI-Powered Ingestion
        chunks = process_pdf(file_path)
        
        # FIX: Check if chunks is empty before proceeding
        if not chunks:
            return jsonify({
                "error": "The PDF was processed but no text sections were found. Please try a different paper."
            }), 422
        
        # 2. Cloud Vector Storage with Session Isolation
        sync_to_supabase(chunks, file_id)
        
        # 3. High-Fidelity Summary Generation (No More Tunnel Vision)
        summary_text = generate_summary(chunks)
        
        return jsonify({
            "status": "Success", 
            "summary": summary_text,
            "file_id": file_id
        })
        
    except Exception as e:
        print(f"Error during upload/processing: {e}")
        return jsonify({"error": f"Internal processing error: {str(e)}"}), 500
    finally:
        # Cleanup: Always remove the temporary file to prevent disk fill-up
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"🧹 Server Hygiene: Deleted temporary file {file_path}")
            except Exception as cleanup_error:
                print(f"⚠️ Warning: Failed to delete {file_path}: {cleanup_error}")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    file_id = data.get('file_id')
    if not file_id:
        return jsonify({"error": "No file_id provided"}), 400

    try:
        vector_store = get_vector_store()
        chain = get_rag_chain(vector_store, file_id)
        response = chain.invoke(data['message'])
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error during chat: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    if not data or 'text' not in data or 'targetLang' not in data:
        return jsonify({"error": "Missing text or targetLang"}), 400
    
    text = data['text']
    target_lang = data['targetLang']
    
    try:
        llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
        
        prompt = f"Translate the following text to {target_lang}. details only return the translated text without any other text/explanation:\n\n{text}"
        response = llm.invoke(prompt)
        
        return jsonify({"translatedText": response.content})
    except Exception as e:
        print(f"Error during translation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)