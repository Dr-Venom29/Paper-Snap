import re
import requests
import random
from sympy import sympify, simplify
from sympy.core.sympify import SympifyError
from transformers import pipeline
from duckduckgo_search.duckduckgo_search import DDGS
from common_utils import (
    load_and_clean_pdf,
    chunk_texts,
    create_embedding_model,
    create_chroma_db,
    load_flan_t5_model,
    create_tokenizer
)
from better_profanity import profanity
profanity.load_censor_words()

WOLFRAM_APP_ID = "6H5AHJ-KPUA2XT78K"

def setup_docsearch(file_path: str):
    docs = load_and_clean_pdf(file_path)
    tokenizer = create_tokenizer()
    chunks = chunk_texts(docs, tokenizer=tokenizer, max_tokens=1024)
    embedding_model = create_embedding_model()
    db = create_chroma_db(chunks, embedding_model, file_path)
    return db

model, model_tokenizer = load_flan_t5_model()
llm = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=model_tokenizer,
    max_new_tokens=256,
    device_map="auto",
)

def enhance_query(query: str) -> str:
    return (
        f"Please answer this question clearly and in detail, using professional language and well-structured explanations. "
        f"Focus on accuracy and completeness. "
        f"Question: {query}"
    )

def is_math_question(text: str) -> bool:
    math_keywords = [
        "calculate", "solve", "equation", "formula", "add", "subtract", "multiply", "divide",
        "logarithm", "sum", "product", "derivative", "integrate", "plus", "minus", "quotient",
        "remainder", "exponent", "fraction", "area", "perimeter", "volume", "surface area",
        "root", "square root", "cube root"
    ]
    text_lower = text.lower()
    # If any math keyword is present, it's a math question
    if any(kw in text_lower for kw in math_keywords):
        return True
    # Otherwise, require BOTH a number and a math operator (+ - * / ^ =)
    if re.search(r"\d", text_lower) and re.search(r"[\+\-\*\/\^=]", text_lower):
        return True
    return False

def solve_math(question):
    url = "https://api.wolframalpha.com/v2/query"
    params = {
        "input": question,
        "appid": WOLFRAM_APP_ID,
        "output": "JSON",
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        pods = data.get("queryresult", {}).get("pods", [])
        answer = None
        for pod in pods:
            if pod.get("title", "").lower() == "result":
                subpods = pod.get("subpods", [])
                if subpods:
                    answer = subpods[0].get("plaintext")
                break
        if answer:
            print("[WolframAlpha] Success: Answer retrieved.")
            return answer
        else:
            print("[WolframAlpha] No result pod found. Falling back to SymPy.")

    except Exception as e:
        print(f"WolframAlpha API error: {e}")

    try:
        expr = re.sub(r"[^\d\.\+\-\*\/\^\(\)x ]", "", question.lower())
        expr = expr.replace("^", "**")
        sym_expr = sympify(expr)
        result = simplify(sym_expr)
        return str(result)
    except (SympifyError, Exception):
        return None

funny_math_prompts = [
    "Dies from overthinking... Last words:",
    "My monkey brain calculated:",
    "I used the math to destroy the math ",
    "Never fear, MATH MAN is here with:",
    "Brain freeze... but I'm pretty sure it's ",
    "ERROR... JUST KIDDING! The answer is ",
]
DOC_LEVEL_KEYWORDS = [
    "topic", "topics", "conclusion", "summary", "summarize",
    "main point", "main idea", "outline", "key point"
]

def wikidata_fallback(query):
    search_url = "https://www.wikidata.org/w/api.php"
    search_params = {
        "action": "wbsearchentities",
        "search": query,
        "language": "en",
        "format": "json",
    }

    try:
        search_response = requests.get(search_url, params=search_params, timeout=5)
        search_response.raise_for_status()
        search_data = search_response.json()

        if not search_data.get("search"):
            return None

        entity_id = search_data["search"][0]["id"]

        details_url = "https://www.wikidata.org/w/api.php"
        details_params = {
            "action": "wbgetentities",
            "ids": entity_id,
            "languages": "en",
            "format": "json",
        }

        details_response = requests.get(details_url, params=details_params, timeout=5)
        details_response.raise_for_status()
        entity_data = details_response.json()

        entity = entity_data["entities"][entity_id]
        if "descriptions" in entity and "en" in entity["descriptions"]:
            return entity["descriptions"]["en"]["value"]
        elif "labels" in entity and "en" in entity["labels"]:
            return entity["labels"]["en"]["value"] + " (no description available)"
        else:
            return None

    except Exception as e:
        print(f"[Wikidata] Error: {e}")
        return None

def search_image(query, max_results=3):
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images(query, max_results=max_results))
            if not results:
                return ["No images found."]
            urls = [result["image"] for result in results]
            return urls
    except Exception as e:
        return [f"Image search failed: {e}"]

def duckduckgo_fallback(query):
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=2))
        if not results:
            return None
        return results[0]["body"]

def is_prompt_safe(prompt: str) -> bool:
    return not profanity.contains_profanity(prompt)

# Hybrid chatbot class
class HybridChatbot:
    def __init__(self, docsearch, llm):
        print("HybridChatbot __init__ called with docsearch and llm")
        self.docsearch = docsearch
        self.llm = llm
        self.user_name = None

    def generate_response(self, prompt: str) -> str:
        response = self.llm(prompt, do_sample=True)
        answer = response[0]["generated_text"].strip()
        if self.user_name:
            answer = f"{self.user_name}, {answer}"
        if len(answer.split()) < 2:
            return "Sorry, I couldn't understand. Could you rephrase?"
        return answer
    
    def is_doc_level_question(question):
        q = question.lower()
        return any(keyword in q for keyword in DOC_LEVEL_KEYWORDS)

    def get_answer(self, question: str) -> str:
        if not is_prompt_safe(question):
            return "⚠️ Sorry, I can't respond to inappropriate or offensive content."

        question_lower = question.lower()

        if "my name is" in question_lower:
            self.user_name = question_lower.split("my name is")[-1].strip().split()[0].capitalize()
            return f"Hi {self.user_name}! How can I help you today?"

        image_keywords = ["show image of", "picture of", "image of", "photo of","diagram of","map of","gif of"]
        if any(kw in question_lower for kw in image_keywords):
            # Extract query after the keyword
            for kw in image_keywords:
                if kw in question_lower:
                    query = question_lower.split(kw)[-1].strip()
                    break
            urls = search_image(query)
            if not urls:
                return f"Sorry, I couldn't find any images for '{query}'."
            # Return first image URL (or multiple URLs if you want)
            return f"Here is an image of {query} {urls[0]}"

        if is_math_question(question):
            math_answer = solve_math(question)
            if math_answer:
                funny_intro = random.choice(funny_math_prompts)
                return f"{funny_intro} {math_answer}"

        # Document similarity search
        docs_with_scores = self.docsearch.similarity_search_with_relevance_scores(question, k=3)
        if docs_with_scores:
            normalized_docs = [(doc, (score + 1) / 2) for doc, score in docs_with_scores if -1 <= score <= 1]
            threshold = 0.5
            relevant_docs = [doc for doc, norm_score in normalized_docs if norm_score > threshold]

            if relevant_docs:
                context = "\n\n".join([doc.page_content for doc in relevant_docs[:2]])
                prompt = f"""
You are a helpful assistant. Answer the question using the context below. If the context doesn't provide enough information, use your general knowledge, but always aim to give a clear and complete answer.

Context:
{context}

Question:
{question}
Answer in complete sentences:"""
                return self.generate_response(prompt)

        fallback_text = wikidata_fallback(question)
        if not fallback_text:
            fallback_text = duckduckgo_fallback(question)
        if fallback_text:
            prompt = f"Use the following information to answer clearly:\n\n{fallback_text}\n\nQuestion: {question}\nAnswer:"
            return self.generate_response(prompt)

        enhanced_question = enhance_query(question)
        return self.generate_response(enhanced_question)