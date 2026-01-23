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