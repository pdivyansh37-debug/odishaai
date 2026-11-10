import enum
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class GrievanceCategory(str, enum.Enum):
    road = "road"
    water = "water"
    ration = "ration"
    education = "education"
    health = "health"
    land = "land"
    other = "other"


class GrievanceStatus(str, enum.Enum):
    pending = "pending"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    overdue = "overdue"
    escalated = "escalated"


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, index=True, nullable=False)
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    category = Column(SAEnum(GrievanceCategory), nullable=False, default=GrievanceCategory.other)
    dept_assigned = Column(String(255), nullable=True)
    status = Column(SAEnum(GrievanceStatus), nullable=False, default=GrievanceStatus.pending)
    sla_deadline = Column(DateTime(timezone=True), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    citizen = relationship("Citizen", back_populates="grievances")
    notifications = relationship("Notification", back_populates="grievance", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Grievance id={self.id} ticket_id={self.ticket_id} status={self.status}>"
