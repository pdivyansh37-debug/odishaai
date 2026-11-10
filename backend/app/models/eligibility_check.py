from sqlalchemy import Column, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class EligibilityCheck(Base):
    __tablename__ = "eligibility_checks"

    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("citizens.id"), nullable=False)
    schemes_matched = Column(JSON, nullable=True, default=[])
    input_data_json = Column(JSON, nullable=True, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    citizen = relationship("Citizen", back_populates="eligibility_checks")

    def __repr__(self):
        return f"<EligibilityCheck id={self.id} citizen_id={self.citizen_id}>"
