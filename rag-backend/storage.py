import os
from dotenv import load_dotenv, find_dotenv
from supabase.client import create_client
from langchain_cohere import CohereEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore

load_dotenv(find_dotenv())


def get_vector_store():
    embeddings = CohereEmbeddings(
        model="embed-english-v3.0",
        cohere_api_key=os.getenv("COHERE_API_KEY")
    )
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env")

    supabase_client = create_client(url, key)
    
    return SupabaseVectorStore(
        client=supabase_client,
        embedding=embeddings,
        table_name="documents",
        query_name="match_documents"
    )

def sync_to_supabase(documents, file_id=None):
    # FIX: Return early if there are no documents to sync
    if not documents:
        print("Error: No documents provided for Supabase sync.")
        return None

    # Add file_id to metadata for session isolation
    if file_id:
        for doc in documents:
            doc.metadata['file_id'] = file_id

    embeddings = CohereEmbeddings(
        model="embed-english-v3.0",
        cohere_api_key=os.getenv("COHERE_API_KEY")
    )
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env")

    supabase_client = create_client(url, key)
    
    try:
        # Sync documents to cloud vector store
        vector_store = SupabaseVectorStore.from_documents(
            documents,
            embeddings,
            client=supabase_client,
            table_name="documents",
            query_name="match_documents"
        )
        return vector_store
    except Exception as e:
        print(f"Supabase Sync Error: {e}")
        return None