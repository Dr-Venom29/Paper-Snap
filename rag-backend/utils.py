import re
import time
from langchain_core.documents import Document

def clean_academic_text(text: str) -> str:
    """Removes common research paper noise like citations and page artifacts."""
    # Standardize whitespace and remove excessive dots
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\.{2,}', '.', text)
    
    # Remove common academic artifacts (IEEE/arXiv draft marks)
    text = re.sub(r'\b(IEEE|arXiv|Confidential|Draft)\b', '', text, flags=re.IGNORECASE)
    
    # Remove bracketed citations (e.g., [1], [1, 2, 3])
    text = re.sub(r'\[\d+(,\s*\d+)*\]', '', text)
    
    return text.strip()

def format_metadata(source_path: str, page_num: int = None) -> dict:
    """Enriches chunks with source-tracking metadata."""
    return {
        "file_name": source_path.split("/")[-1],
        "page": page_num if page_num else "N/A",
        "processed_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

def log_performance(func):
    """Decorator to measure and log the speed of API calls (Groq/Cohere)."""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        print(f"⏱️ {func.__name__} took {duration:.2f} seconds")
        return result
    return wrapper

def truncate_content(content: str, max_length: int = 400) -> str:
    """Truncates content for display in logs or UI previews."""
    return f"{content[:max_length]}..." if len(content) > max_length else content