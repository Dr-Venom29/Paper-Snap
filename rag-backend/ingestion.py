import os
import langextract as lx
import textwrap
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from dotenv import load_dotenv
load_dotenv()


def process_pdf(file_path):
    # Safety Check: Ensure the file exists
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return []

    loader = PyPDFLoader(file_path)
    raw_docs = loader.load()
    
    # FIX: Check if PDF loader returned any pages
    if not raw_docs:
        print("Warning: PDF is empty or unreadable.")
        return []
    
    # Check if API key is in environment
    if not os.environ.get("LANGEXTRACT_API_KEY"):
         print("Warning: LANGEXTRACT_API_KEY not found in environment variables.")

    prompt = textwrap.dedent("""
        Extract the main sections of the research paper including:
        Abstract, Methodology, Results, and Conclusion.
    """)

    examples = [
        lx.data.ExampleData(
            text="The study found a 20% increase in efficiency. Methodology: Linear regression.",
            extractions=[
                lx.data.Extraction(extraction_class="Finding", extraction_text="20% increase in efficiency"),
                lx.data.Extraction(extraction_class="Methodology", extraction_text="Linear regression")
            ]
        )
    ]

    processed_chunks = []
    for doc in raw_docs:
        # Skip pages with no content to avoid index errors
        if not doc.page_content.strip():
            continue

        try:
            result = lx.extract(
                text_or_documents=doc.page_content,
                prompt_description=prompt,
                examples=examples,
                model_id="gemini-2.5-flash"
            )
            
            # FIX: Ensure result and extractions list are valid
            if result and hasattr(result, 'extractions') and result.extractions:
                for entry in result.extractions:
                    processed_chunks.append(Document(
                        page_content=entry.extraction_text,
                        metadata={"class": entry.extraction_class, "source": file_path}
                    ))
            else:
                print("No extractions found for this page.")
                
        except Exception as e:
            print(f"Extraction error on page: {e}")
            continue
    
    # --- FALLBACK MECHANISM ---
    # If AI extraction failed to find structured sections, fall back to standard text chunking.
    if not processed_chunks:
        print("⚠️ Smart Extraction yielded zero results. Switching to Standard Fallback (RecursiveCharacterTextSplitter).")
        # Correct import path for newer LangChain versions
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        processed_chunks = text_splitter.split_documents(raw_docs)
        
        # Add metadata so usage downstream remains consistent
        for doc in processed_chunks:
            if "source" not in doc.metadata:
                doc.metadata["source"] = file_path
            doc.metadata["class"] = "General Content"

    return processed_chunks