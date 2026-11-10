from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    aadhaar_last4 = Column(String(4), nullable=True)
    district = Column(String(100), nullable=True)
    block = Column(String(100), nullable=True)
    profile_json = Column(JSON, nullable=True, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    grievances = relationship("Grievance", back_populates="citizen", cascade="all, delete-orphan")
    eligibility_checks = relationship("EligibilityCheck", back_populates="citizen", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Citizen id={self.id} phone={self.phone} name={self.name}>"
