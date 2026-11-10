from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class SchemeOut(BaseModel):
    id: int
    name_odia: str
    name_en: str
    dept: str
    benefits: Optional[str] = None
    eligibility_criteria: Optional[Dict[str, Any]] = {}
    documents_required: Optional[List[str]] = []
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EligibilityRequest(BaseModel):
    age: int
    income: float
    caste: str  # e.g. "SC", "ST", "OBC", "General"
    land_holding: float = 0.0  # in acres
    occupation: str  # farmer, laborer, self_employed, etc.
    district: str
    gender: Optional[str] = None  # male / female / other
    is_bpl: Optional[bool] = None
    has_disability: Optional[bool] = False
    is_widow: Optional[bool] = False
    num_children: Optional[int] = 0
    education_level: Optional[str] = None  # primary, secondary, graduate


class EligibilityResponse(BaseModel):
    matched_schemes: List[Dict[str, Any]] = []
    total_found: int = 0
    input_summary: Optional[str] = None
