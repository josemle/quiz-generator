import os
import json
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser

from . import crud, models, schemas
from .database import engine, get_db

# Load environment variables from .env file
load_dotenv()

# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IntelliQuiz API",
    description="API for generating quizzes from Wikipedia articles.",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows the React frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def scrape_wikipedia_content(url: str):
    """Scrapes the title, main text content, and section headers from a Wikipedia URL."""
    try:
        headers = {'User-Agent': 'IntelliQuizApp/1.0 (test@example.com)'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        soup = BeautifulSoup(response.content, 'html.parser')
        
        title = soup.find('h1', id='firstHeading')
        if not title:
            raise ValueError("Could not find article title.")
        
        content_div = soup.find('div', id='mw-content-text')
        if not content_div:
             raise ValueError("Could not find article content.")
        
        # Extract meaningful text, ignoring sidebars and tables
        paragraphs = content_div.find_all('p', limit=20, recursive=False)
        text_content = "\n".join([p.get_text() for p in paragraphs if p.get_text().strip()])

        sections = [h2.get_text().replace('[edit]', '').strip() for h2 in content_div.find_all('h2')]
        
        return {
            "title": title.text, 
            "text_content": text_content, 
            "sections": sections,
            "raw_html": response.text
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {e}")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Error parsing page content: {e}")


def generate_quiz_with_llm(text_content: str, title: str):
    """Uses Google's Gemini model via LangChain to generate quiz data from text."""
    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=os.getenv("GEMINI_API_KEY"), temperature=0.7)
    
    prompt_template = """
    Based on the following text about "{title}", generate a comprehensive JSON object for a quiz.
    The JSON object must have the following keys: "summary", "key_entities", "quiz", and "related_topics".

    - "summary": A concise 2-3 sentence summary of the text.
    - "key_entities": A dictionary with "people", "organizations", and "locations" as keys, each with a list of relevant names.
    - "quiz": A list of 5 to 7 quiz questions. Each question object must have: "question", "options" (a list of 4 unique strings), "answer" (the correct option), "explanation" (why the answer is correct), and "difficulty" ('easy', 'medium', or 'hard').
    - "related_topics": A list of 3-5 related Wikipedia topics.

    TEXT CONTENT:
    {text}
    
    IMPORTANT: Provide ONLY the raw JSON object, without any surrounding text, comments, or markdown formatting like ```json.
    """
    
    prompt = PromptTemplate.from_template(prompt_template)
    chain = prompt | llm | StrOutputParser()
    
    response_str = chain.invoke({"text": text_content, "title": title})
    
    try:
        # The response should be a clean JSON string, but we clean it just in case
        clean_json_str = response_str.strip().replace("```json", "").replace("```", "")
        return json.loads(clean_json_str)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to generate a valid quiz structure from the AI model.")


# --- API Endpoints ---

@app.post("/generate-quiz/", response_model=schemas.Quiz, status_code=201)
def generate_quiz_from_url(req: schemas.QuizGenerationRequest, db: Session = Depends(get_db)):
    """
    Main endpoint to generate a quiz. Checks for an existing quiz in the DB first.
    If not found, it scrapes the URL, generates the quiz via LLM, and saves it.
    """
    url_str = str(req.url)
    db_quiz = crud.get_quiz_by_url(db, url=url_str)
    if db_quiz:
        return db_quiz

    scraped_data = scrape_wikipedia_content(url_str)
    if not scraped_data['text_content']:
        raise HTTPException(status_code=422, detail="Could not extract enough content from the article to generate a quiz.")

    llm_data = generate_quiz_with_llm(scraped_data["text_content"], scraped_data["title"])
    
    # Consolidate all data for database insertion
    full_quiz_data = schemas.QuizCreate(
        url=url_str,
        title=scraped_data["title"],
        raw_html=scraped_data["raw_html"],
        summary=llm_data.get("summary", "No summary provided."),
        key_entities=llm_data.get("key_entities", {}),
        sections=scraped_data["sections"],
        quiz_data=llm_data.get("quiz", []),
        related_topics=llm_data.get("related_topics", []),
    )
    
    return crud.create_quiz(db=db, quiz_data=full_quiz_data)

@app.get("/quizzes/", response_model=List[schemas.Quiz])
def read_all_quizzes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieves a list of all previously generated quizzes."""
    quizzes = crud.get_quizzes(db, skip=skip, limit=limit)
    return quizzes

@app.get("/validate-url/", response_model=dict)
def validate_url(url: str):
    """A lightweight endpoint for the frontend to quickly check if a URL is valid and get its title."""
    try:
        headers = {'User-Agent': 'IntelliQuizApp/1.0 (test@example.com)'}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.find('h1', id='firstHeading')
        if title:
            return {"title": title.text}
        raise HTTPException(status_code=422, detail="URL is valid but no article title was found.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=400, detail="Invalid or unreachable URL.")