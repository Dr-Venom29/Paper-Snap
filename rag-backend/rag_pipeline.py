import torch
import re
from transformers import pipeline
from common_utils import (
    load_and_clean_pdf,
    chunk_texts,
    create_embedding_model,
    create_chroma_db,
    load_flan_t5_model,
    create_tokenizer
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def polish_summary(summary: str) -> str:
    summary = re.sub(r'\s+', ' ', summary)
    summary = re.sub(r'(?<=\w)\.(?=\w)', '. ', summary)
    summary = re.sub(r'\s([?.!"](?:\s|$))', r'\1', summary)
    summary = summary.strip().capitalize()
    summary = re.sub(r'(?<=[.:!?]\s)([a-z])', lambda m: m.group(1).upper(), summary)
    summary = re.sub(r'\.{2,}', '.', summary)
    return summary

def remove_redundant_lines(summary: str) -> str:
    lines = summary.split('. ')
    unique_lines = []
    seen = set()
    for line in lines:
        cleaned = line.strip().lower()
        if cleaned not in seen and cleaned:
            seen.add(cleaned)
            unique_lines.append(line)
    return '. '.join(unique_lines)

def remove_repeated_phrases(text: str, min_len=5) -> str:
    words = text.split()
    seen_phrases = set()
    result = []
    i = 0
    while i < len(words):
        phrase = ' '.join(words[i:i + min_len])
        if len(words[i:i + min_len]) < min_len:
            result.extend(words[i:])
            break
        if phrase.lower() in seen_phrases:
            i += min_len
        else:
            seen_phrases.add(phrase.lower())
            result.append(words[i])
            i += 1
    return ' '.join(result)

def remove_cut_off_sentences(text: str) -> str:
    sentences = re.split(r'(?<=[.!?]) +', text)
    filtered = [
        s for s in sentences
        if len(s.strip().split()) > 4 and not s.strip().endswith(('for example', 'like', 'such as'))
    ]
    return ' '.join(filtered)

def add_paragraph_breaks(text: str, max_sentences_per_paragraph=3) -> str:
    sentences = re.split(r'(?<=[.!?]) +', text)
    paragraphs = [
        ' '.join(sentences[i:i + max_sentences_per_paragraph])
        for i in range(0, len(sentences), max_sentences_per_paragraph)
    ]
    return '\n\n'.join(paragraphs)

def run_rag_pipeline(file_path: str) -> str:
    try:
        print(f"\n📄 Starting summarization for: {file_path}")

        # Step 1: Load and clean document
        docs = load_and_clean_pdf(file_path)

        tokenizer = create_tokenizer()
        chunks = chunk_texts(docs, tokenizer=tokenizer, max_tokens=512)

        # Step 3: Create embedding model
        embedding_model = create_embedding_model()

        # Step 4: Create/load ChromaDB
        db = create_chroma_db(chunks, embedding_model, file_path)

        # Step 5: Load summarization model
        model, model_tokenizer = load_flan_t5_model()
        summarizer = pipeline(
            "summarization",
            model=model,
            tokenizer=model_tokenizer,
            device=0 if device.type == "cuda" else -1
        )

        query = "Summarize the document."
        results = db.similarity_search(query, k=10)

        combined_text = " ".join([doc.page_content for doc in results])
        final_prompt = (
    "Read the following content and generate a coherent and informative summary. "
    "Structure the summary logically with a clear beginning, middle, and end. "
    "Preserve the key ideas, avoid repetition, and use fluent, natural English. "
    "Ensure the tone is formal, the points are logically ordered, and sentences are complete:\n\n"
    + combined_text
)

        max_summary_tokens = min(450, int(len(combined_text.split()) * 0.5))
        summary_output = summarizer(
            final_prompt,
            max_new_tokens=max_summary_tokens,
            min_length=150,
            truncation=True,
            num_beams=4,
            repetition_penalty=1.2, 
            no_repeat_ngram_size=4
        )
        raw_summary = summary_output[0]['summary_text']

        step1 = remove_cut_off_sentences(raw_summary)
        step2 = remove_redundant_lines(step1)
        step3 = remove_repeated_phrases(step2)
        step4 = polish_summary(step3)
        final_summary = add_paragraph_breaks(step4)

        print(f"\n Summary generated successfully. Length: {len(final_summary)} characters")
        return final_summary

    except Exception as e:
        print(f"❌ Error during summarization: {e}")
        return f"Failed to generate summary: {e}"