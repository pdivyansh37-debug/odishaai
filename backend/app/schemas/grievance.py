from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.grievance import GrievanceCategory, GrievanceStatus


class GrievanceCreate(BaseModel):
    phone: str  # citizen phone to look up / auto-create citizen
    description: str
    category: Optional[GrievanceCategory] = None  # auto-detected via AI if not provided
    lat: Optional[float] = None
    lng: Optional[float] = None
    name: Optional[str] = None  # citizen name (optional)
    district: Optional[str] = None


class GrievanceOut(BaseModel):
    id: int
    ticket_id: str
    category: GrievanceCategory
    dept_assigned: Optional[str] = None
    status: GrievanceStatus
    description: str
    image_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    sla_deadline: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GrievanceDetail(BaseModel):
    id: int
    ticket_id: str
    category: GrievanceCategory
    dept_assigned: Optional[str] = None
    status: GrievanceStatus
    description: str
    image_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    sla_deadline: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    citizen_phone: Optional[str] = None
    citizen_name: Optional[str] = None
    district: Optional[str] = None

    class Config:
        from_attributes = True


class GrievanceStatusUpdate(BaseModel):
    status: GrievanceStatus
    remark: Optional[str] = None


class GrievanceAssign(BaseModel):
    officer_id: int
    dept_assigned: str


class TicketLookup(BaseModel):
    ticket_id: str
    phone: Optional[str] = None  # optional verification
