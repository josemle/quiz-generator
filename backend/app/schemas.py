from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any

# --- Request Models ---

class QuizGenerationRequest(BaseModel):
    url: HttpUrl # Pydantic validates the URL format

# --- Response Models ---

class Quiz(BaseModel):
    id: int
    url: HttpUrl
    title: str
    summary: str
    quiz_data: List[Dict[str, Any]]
    key_entities: Dict[str, List[str]]
    sections: List[str]
    related_topics: List[str]

    class Config:
        from_attributes = True # Replaces orm_mode for Pydantic v2

# Model for listing quizzes in the history tab (lighter version)
class QuizInfo(BaseModel):
    id: int
    url: HttpUrl
    title: str

    class Config:
        from_attributes = True

# --- Internal Data Models ---

class QuizCreate(BaseModel):
    url: HttpUrl
    title: str
    summary: str
    quiz_data: List[Dict[str, Any]]
    key_entities: Dict[str, List[str]]
    sections: List[str]
    related_topics: List[str]
    raw_html: str