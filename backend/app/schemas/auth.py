from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.officer import OfficerRole


class OfficerLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    officer_id: int
    officer_name: str
    role: OfficerRole


class TokenData(BaseModel):
    officer_id: Optional[int] = None
    email: Optional[str] = None


class OfficerCreate(BaseModel):
    name: str
    email: str
    password: str
    dept: Optional[str] = None
    district: Optional[str] = None
    role: OfficerRole = OfficerRole.officer


class OfficerOut(BaseModel):
    id: int
    name: str
    email: str
    dept: Optional[str] = None
    district: Optional[str] = None
    role: OfficerRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
