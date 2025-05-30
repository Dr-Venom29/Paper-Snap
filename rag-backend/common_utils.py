import os
import re
import torch
from tqdm import tqdm
from cleantext import clean
from nltk.tokenize import sent_tokenize
from langchain_community.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM,PreTrainedTokenizer
from langchain.schema import Document
import nltk
nltk.download('punkt')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

def load_and_clean_pdf(file_path: str) -> list[Document]:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext == ".docx":
        loader = UnstructuredWordDocumentLoader(file_path)
    else:
        raise ValueError("Unsupported file format. Only pdf and docx format are supported.")

    pages = loader.load_and_split()

    def clean_text(text: str) -> str:
        text = clean(text,
                     fix_unicode=True,
                     to_ascii=True,
                     no_line_breaks=True,
                     no_urls=True,
                     no_emails=True,
                     no_phone_numbers=True)
        text = re.sub(r'-\s*\n\s*', '', text)
        text = re.sub(r'\[\d+(,\s*\d+)*\]', '', text)
        text = re.sub(r'\[\w{1,2}\]', '', text)
        text = re.sub(r'\(\w{1,2}\)', '', text)
        text = re.sub(r'\bPage\s*\d+\b', '', text, flags=re.IGNORECASE)
        text = re.sub(r'\b(MIT|Confidential|Draft|IEEE|arXiv|Conference)\b', '', text, flags=re.IGNORECASE)
        return text.strip()

    for doc in pages:
        doc.page_content = clean_text(doc.page_content)
    print(f"Cleaned {len(pages)} pages")
    return pages

def create_tokenizer(token_name="google/flan-t5-base") -> PreTrainedTokenizer:
    return AutoTokenizer.from_pretrained(token_name)

def chunk_texts(docs: list[Document], tokenizer: PreTrainedTokenizer, max_tokens=1024) -> list[Document]:
    
    all_texts = [doc.page_content for doc in docs]
    total_words = sum(len(text.split()) for text in all_texts)
    chunk_size = 800 if total_words < 3000 else 1000
    print(f"Total words: {total_words} | Using chunk_size: {chunk_size}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=80,
        length_function=lambda text: len(tokenizer.encode(text, add_special_tokens=False)),
        is_separator_regex=False
    )
    initial_chunks = text_splitter.split_documents(docs)

    final_chunks = []
    oversized_count = 0
    batch_token_counts = [len(tokenizer.encode(doc.page_content, add_special_tokens=False)) for doc in initial_chunks]

    for doc, token_count in zip(initial_chunks, batch_token_counts):
        content = doc.page_content
        if token_count <= max_tokens:
            final_chunks.append(Document(page_content=content))
        else:
            oversized_count += 1
            sentences = sent_tokenize(content)
            temp_chunk = []
            curr_token_count = 0
            for sent in sentences:
                sent_tokens = tokenizer.encode(sent, add_special_tokens=False)
                if curr_token_count + len(sent_tokens) > max_tokens:
                    final_chunks.append(Document(page_content=" ".join(temp_chunk)))
                    temp_chunk = [sent]
                    curr_token_count = len(sent_tokens)
                else:
                    temp_chunk.append(sent)
                    curr_token_count += len(sent_tokens)
            if temp_chunk:
                final_chunks.append(Document(page_content=" ".join(temp_chunk)))

    print(f"Total chunks after token split: {len(final_chunks)} | Oversized chunks handled: {oversized_count}")
    return final_chunks

def create_embedding_model(device=device):
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': device}
    )

def create_chroma_db(docs: list[Document], embedding_model, file_path: str) -> Chroma:
    persist_directory = f"./chroma_db/{os.path.basename(file_path)}"
    collection_name = "rag_collection"

    if os.path.exists(persist_directory) and os.listdir(persist_directory):
        print(f"Chroma DB exists at '{persist_directory}', attempting to load...")
        try:
            db = Chroma(
                persist_directory=persist_directory,
                embedding_function=embedding_model,
                collection_name=collection_name
            )
            print("Chroma DB loaded successfully.")
        except Exception as e:
            print(f"⚠ Warning: Failed to load existing Chroma DB due to: {e}")
            print("Rebuilding the Chroma DB from documents...")
            db = Chroma.from_documents(
                docs,
                embedding=embedding_model,
                persist_directory=persist_directory,
                collection_name=collection_name
            )
            print("Rebuilt and persisted the Chroma DB.")
    else:
        print(f"No existing Chroma DB found at '{persist_directory}'. Creating a new one...")
        db = Chroma.from_documents(
            docs,
            embedding=embedding_model,
            persist_directory=persist_directory,
            collection_name=collection_name
        )
        print("Created and persisted new Chroma DB.")

    return db

def load_flan_t5_model(model_name="google/flan-t5-large"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
    )
    model.to(device)
    return model, tokenizer