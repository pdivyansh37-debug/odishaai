from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    message: str
    language: str = "odia"  # odia | hindi | english
    session_id: str = "default"
    phone: Optional[str] = None  # citizen phone for context


class ChatResponse(BaseModel):
    response: str
    intent: str  # scheme_query | grievance | general | legal
    language: str
    matched_schemes: List[dict] = []
    ticket_id: Optional[str] = None
    suggestions: List[str] = []
