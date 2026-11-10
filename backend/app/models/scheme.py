from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name_odia = Column(String(500), nullable=False)
    name_en = Column(String(500), nullable=False, index=True)
    dept = Column(String(255), nullable=False)
    benefits = Column(Text, nullable=True)
    rules_json = Column(JSON, nullable=True, default={})
    eligibility_criteria = Column(JSON, nullable=True, default={})
    documents_required = Column(JSON, nullable=True, default=[])
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Scheme id={self.id} name_en={self.name_en}>"
