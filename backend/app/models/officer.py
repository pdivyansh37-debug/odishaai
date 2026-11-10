import enum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum as SAEnum
from sqlalchemy.sql import func
from app.database import Base


class OfficerRole(str, enum.Enum):
    officer = "officer"
    supervisor = "supervisor"
    collector = "collector"
    admin = "admin"


class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    dept = Column(String(255), nullable=True)
    district = Column(String(100), nullable=True)
    role = Column(SAEnum(OfficerRole), nullable=False, default=OfficerRole.officer)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Officer id={self.id} email={self.email} role={self.role}>"
