from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any
from datetime import datetime


class CitizenCreate(BaseModel):
    phone: str
    name: Optional[str] = None
    aadhaar_last4: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    profile_json: Optional[Dict[str, Any]] = {}

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = "".join(filter(str.isdigit, v))
        if len(digits) < 10:
            raise ValueError("Phone number must have at least 10 digits")
        return v

    @field_validator("aadhaar_last4")
    @classmethod
    def validate_aadhaar(cls, v: Optional[str]) -> Optional[str]:
        if v and (len(v) != 4 or not v.isdigit()):
            raise ValueError("aadhaar_last4 must be exactly 4 digits")
        return v


class CitizenOut(BaseModel):
    id: int
    phone: str
    name: Optional[str] = None
    aadhaar_last4: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CitizenProfile(BaseModel):
    id: int
    phone: str
    name: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    profile_json: Optional[Dict[str, Any]] = {}
    grievance_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True
