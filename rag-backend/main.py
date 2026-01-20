from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import re
import uuid
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

from rag_pipeline import run_rag_pipeline
from chatbot import setup_docsearch, llm, HybridChatbot
DOCSEARCH_CACHE = {}

app = Flask(__name__)
app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['SESSION_COOKIE_SECURE'] = True
CORS(app, supports_credentials=True)

app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_secret_key_here")

# Ensure upload folder exists
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    print("📥 Upload endpoint hit")

    if 'file' not in request.files:
        print("❌ No file part in request.")
        return jsonify({'summary': '❌ No file provided.'}), 400

    file = request.files['file']
    if file.filename == '':
        print("❌ File name is empty.")
        return jsonify({'summary': '❌ No file selected.'}), 400

    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    print(f"💾 Saving file to: {file_path}")
    file.save(file_path)

    # Store the uploaded file path in session for later use by chatbot
    session['uploaded_file_path'] = file_path

    try:
        summary = run_rag_pipeline(file_path)
        print("✅ Summary generated successfully.")
        return jsonify({'summary': summary})
    except Exception as e:
        print("❌ Error during summarization:", str(e))
        return jsonify({'summary': f"❌ Failed to summarize: {str(e)}"}), 500

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    file_path = session.get('uploaded_file_path')
    if not file_path:
        return jsonify({"error": "No file uploaded yet"}), 400

    # Cache docsearch per uploaded file
    if file_path not in DOCSEARCH_CACHE:
        DOCSEARCH_CACHE[file_path] = setup_docsearch(file_path)
    docsearch = DOCSEARCH_CACHE[file_path]

    chatbot = HybridChatbot(docsearch, llm)
    response = chatbot.get_answer(data["message"])
    img_url_match = re.search(r"(https?://\S+\.(jpg|jpeg|png|gif))", response)
    img_url = img_url_match.group(1) if img_url_match else None
    return jsonify({"response": response, "image_url": img_url})

if __name__ == '__main__':
    app.run(port=8000)