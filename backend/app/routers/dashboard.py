from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.grievance import Grievance, GrievanceStatus, GrievanceCategory
from app.models.citizen import Citizen
from app.models.officer import Officer
from app.services.gemini_service import draft_officer_reply
from app.utils.auth import get_current_officer

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    total = db.query(Grievance).count()
    pending = db.query(Grievance).filter(Grievance.status == GrievanceStatus.pending).count()
    in_progress = db.query(Grievance).filter(Grievance.status == GrievanceStatus.in_progress).count()
    resolved = db.query(Grievance).filter(Grievance.status == GrievanceStatus.resolved).count()
    
    # Overdue checks
    now = datetime.now(timezone.utc)
    overdue = (
        db.query(Grievance)
        .filter(
            Grievance.status.in_([GrievanceStatus.pending, GrievanceStatus.in_progress, GrievanceStatus.assigned]),
            Grievance.sla_deadline < now,
        )
        .count()
    )

    citizens_count = db.query(Citizen).count()

    # Category breakdown
    category_counts = (
        db.query(Grievance.category, func.count(Grievance.id))
        .group_by(Grievance.category)
        .all()
    )
    categories = [{"name": cat.value, "count": count} for cat, count in category_counts]

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "overdue": overdue,
        "total_citizens": citizens_count,
        "categories": categories,
    }


@router.get("/trends")
def get_trends(
    days: int = 7,
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=days - 1)

    daily_data = []
    for i in range(days):
        current_day = start_date + timedelta(days=i)
        next_day = current_day + timedelta(days=1)
        count = (
            db.query(Grievance)
            .filter(
                Grievance.created_at >= datetime.combine(current_day, datetime.min.time()),
                Grievance.created_at < datetime.combine(next_day, datetime.min.time()),
            )
            .count()
        )
        resolved_count = (
            db.query(Grievance)
            .filter(
                Grievance.resolved_at >= datetime.combine(current_day, datetime.min.time()),
                Grievance.resolved_at < datetime.combine(next_day, datetime.min.time()),
            )
            .count()
        )
        daily_data.append(
            {
                "date": current_day.strftime("%b %d"),
                "filed": count,
                "resolved": resolved_count,
            }
        )

    return daily_data


@router.get("/dept-breakdown")
def get_dept_breakdown(
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    dept_counts = (
        db.query(Grievance.dept_assigned, func.count(Grievance.id))
        .group_by(Grievance.dept_assigned)
        .all()
    )
    return [{"dept": dept or "Unassigned", "count": count} for dept, count in dept_counts]


@router.post("/ai-reply/{grievance_id}")
def generate_ai_draft_reply(
    grievance_id: int,
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    draft_reply = draft_officer_reply(
        ticket_id=grievance.ticket_id,
        category=grievance.category.value,
        description=grievance.description,
        status=grievance.status.value,
    )
    return {"draft": draft_reply}

