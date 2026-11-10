import enum
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class NotificationType(str, enum.Enum):
    ticket_created = "ticket_created"
    status_update = "status_update"
    resolution = "resolution"
    escalation = "escalation"


class NotificationChannel(str, enum.Enum):
    whatsapp = "whatsapp"
    sms = "sms"


class NotificationStatus(str, enum.Enum):
    sent = "sent"
    failed = "failed"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False)
    type = Column(SAEnum(NotificationType), nullable=False)
    channel = Column(SAEnum(NotificationChannel), nullable=False, default=NotificationChannel.whatsapp)
    message = Column(Text, nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(SAEnum(NotificationStatus), nullable=False, default=NotificationStatus.sent)

    # Relationships
    grievance = relationship("Grievance", back_populates="notifications")

    def __repr__(self):
        return f"<Notification id={self.id} grievance_id={self.grievance_id} type={self.type}>"
