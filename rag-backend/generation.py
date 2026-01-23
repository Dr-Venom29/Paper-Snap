import os
from langchain_groq import ChatGroq
from langchain_cohere import CohereRerank
# Use the direct retriever import
from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

def get_rag_chain(vector_store, file_id=None):
    # Setup high-speed Groq LLM
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    
    # Setup precision Reranker
    reranker = CohereRerank(model="rerank-english-v3.0", top_n=3)
    
    # Configure retriever with filters
    search_kwargs = {"k": 10}
    if file_id:
        search_kwargs["filter"] = {"file_id": file_id}

    # Create Compression Retriever linking your Supabase store
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=reranker, 
        base_retriever=vector_store.as_retriever(search_kwargs=search_kwargs)
    )

    # RAG Prompt Template
    template = """Answer the question based only on the following context:
    {context}
    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)

    # Build the Chain (LCEL)
    chain = (
        {"context": compression_retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain

def generate_summary(chunks):
    """
    Generates a summary using a large context window to avoid tunnel vision.
    Concatenates up to 100k characters of extracted insights.
    """
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    
    # 1. Concatenate all text from all chunks
    full_text = " ".join([c.page_content for c in chunks])
    
    # 2. Smart Truncation (Safety limit for very large papers)
    # Llama 3.3 context is ~128k tokens. 
    # Use a safer limit of ~40k chars (~10k tokens) to prevent timeouts/rate-limits.
    MAX_CHARS = 40000
    
    if len(full_text) > MAX_CHARS:
        # Keep the First 50% and Last 50% of the allowed budget
        # This ensures we see the Intro and the Conclusion, skipping the middle if needed.
        half_budget = MAX_CHARS // 2
        text_to_analyze = (
            full_text[:half_budget] + 
            "\n\n... [Middle data omitted for brevity] ...\n\n" + 
            full_text[-half_budget:]
        )
    else:
        text_to_analyze = full_text

    prompt = f"""
    You are an expert academic assistant. 
    Analyze the following key points extracted from a research paper and write a concise, professional summary.
    
    Ensure the summary covers:
    1. **Core Problem**: What is the paper trying to solve?
    2. **Methodology**: KEY technical approach unique to this paper (be specific).
    3. **Key Findings**: The most important results (data/numbers).
    4. **Conclusion**: Why does this matter?

    Keep it under 500 words.

    Text Context:
    {text_to_analyze}
    """
    
    try:
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        print(f"Summary Generation Error: {e}")
        # Fallback: Return a partial raw summary so the user sees SOMETHING instead of an error
        return f"⚠️ **AI Summary Unavailable:** {str(e)}\n\n**Preview of Extracted Text:**\n{full_text[:2000]}..."