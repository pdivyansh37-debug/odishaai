from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.citizen import Citizen
from app.models.grievance import Grievance, GrievanceCategory, GrievanceStatus
from app.models.notification import Notification, NotificationType, NotificationChannel
from app.models.officer import Officer, OfficerRole
from app.schemas.grievance import (
    GrievanceCreate,
    GrievanceOut,
    GrievanceDetail,
    GrievanceStatusUpdate,
)
from app.services.ticket_service import (
    generate_ticket_id,
    get_sla_deadline,
    get_dept_for_category,
)
from app.services.gemini_service import (
    categorize_grievance,
    describe_image,
    check_duplicate,
)
from app.services.whatsapp_service import (
    send_ticket_confirmation,
    send_status_update,
    send_resolution_message,
)
from app.utils.auth import get_current_officer, require_role
from app.utils.file_upload import save_upload_file

router = APIRouter(prefix="/api/grievances", tags=["grievances"])


@router.post("", response_model=GrievanceOut, status_code=status.HTTP_201_CREATED)
async def file_grievance(
    phone: str = Form(...),
    description: str = Form(...),
    category: Optional[str] = Form(None),
    name: Optional[str] = Form(None),
    district: Optional[str] = Form(None),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    # Handle optional image upload
    image_url = None
    image_description = ""
    if image and image.filename:
        image_url = await save_upload_file(image, subfolder="grievances")
        # Try to describe image via Gemini Vision
        try:
            image.file.seek(0)
            image_bytes = await image.read()
            image_description = describe_image(image_bytes)
        except Exception:
            pass

    full_description = description
    if image_description:
        full_description += f"\n[AI Photo Analysis]: {image_description}"

    # Determine category
    final_category = category
    if not final_category:
        detected_category = categorize_grievance(full_description)
        try:
            final_category = GrievanceCategory(detected_category)
        except ValueError:
            final_category = GrievanceCategory.other
    else:
        try:
            final_category = GrievanceCategory(final_category)
        except ValueError:
            final_category = GrievanceCategory.other

    # Find or create citizen
    citizen = db.query(Citizen).filter(Citizen.phone == phone).first()
    if not citizen:
        citizen = Citizen(phone=phone, name=name, district=district)
        db.add(citizen)
        db.commit()
        db.refresh(citizen)
    else:
        if name and not citizen.name:
            citizen.name = name
        if district and not citizen.district:
            citizen.district = district
        db.commit()

    # Generate ticket & SLA
    ticket_id = generate_ticket_id(final_category.value)
    sla_deadline = get_sla_deadline(final_category.value)
    dept_assigned = get_dept_for_category(final_category.value)

    grievance = Grievance(
        ticket_id=ticket_id,
        citizen_id=citizen.id,
        category=final_category,
        dept_assigned=dept_assigned,
        status=GrievanceStatus.pending,
        sla_deadline=sla_deadline,
        lat=lat,
        lng=lng,
        description=full_description,
        image_url=image_url,
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)

    # Trigger WhatsApp notification (in background or mock)
    try:
        sent = send_ticket_confirmation(
            phone=phone,
            ticket_id=ticket_id,
            category=final_category.value,
            sla_deadline=sla_deadline,
            description=description,
        )
        notif = Notification(
            grievance_id=grievance.id,
            type=NotificationType.ticket_created,
            channel=NotificationChannel.whatsapp,
            message=f"Ticket {ticket_id} created successfully.",
            status="sent" if sent else "failed",
        )
        db.add(notif)
        db.commit()
    except Exception:
        pass

    return grievance


@router.get("/ticket/{ticket_id}", response_model=GrievanceDetail)
def track_ticket(ticket_id: str, db: Session = Depends(get_db)):
    grievance = db.query(Grievance).filter(Grievance.ticket_id == ticket_id.upper()).first()
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found",
        )

    citizen = db.query(Citizen).filter(Citizen.id == grievance.citizen_id).first()

    return GrievanceDetail(
        id=grievance.id,
        ticket_id=grievance.ticket_id,
        category=grievance.category,
        dept_assigned=grievance.dept_assigned,
        status=grievance.status,
        description=grievance.description,
        image_url=grievance.image_url,
        lat=grievance.lat,
        lng=grievance.lng,
        sla_deadline=grievance.sla_deadline,
        resolved_at=grievance.resolved_at,
        created_at=grievance.created_at,
        updated_at=grievance.updated_at,
        citizen_phone=citizen.phone if citizen else None,
        citizen_name=citizen.name if citizen else None,
        district=citizen.district if citizen else None,
    )


@router.get("", response_model=List[GrievanceDetail])
def list_grievances(
    status: Optional[GrievanceStatus] = None,
    category: Optional[GrievanceCategory] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    query = db.query(Grievance)
    if status:
        query = query.filter(Grievance.status == status)
    if category:
        query = query.filter(Grievance.category == category)
    if search:
        query = query.filter(
            (Grievance.ticket_id.ilike(f"%{search}%"))
            | (Grievance.description.ilike(f"%{search}%"))
        )

    grievances = query.order_by(Grievance.created_at.desc()).offset(offset).limit(limit).all()

    result = []
    for g in grievances:
        c = db.query(Citizen).filter(Citizen.id == g.citizen_id).first()
        if district and c and c.district and district.lower() not in c.district.lower():
            continue
        result.append(
            GrievanceDetail(
                id=g.id,
                ticket_id=g.ticket_id,
                category=g.category,
                dept_assigned=g.dept_assigned,
                status=g.status,
                description=g.description,
                image_url=g.image_url,
                lat=g.lat,
                lng=g.lng,
                sla_deadline=g.sla_deadline,
                resolved_at=g.resolved_at,
                created_at=g.created_at,
                updated_at=g.updated_at,
                citizen_phone=c.phone if c else None,
                citizen_name=c.name if c else None,
                district=c.district if c else None,
            )
        )
    return result


@router.put("/{grievance_id}/status", response_model=GrievanceOut)
def update_status(
    grievance_id: int,
    status_update: GrievanceStatusUpdate,
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(get_current_officer),
):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found",
        )

    old_status = grievance.status
    grievance.status = status_update.status
    grievance.updated_at = datetime.now(timezone.utc)

    if status_update.status == GrievanceStatus.resolved and old_status != GrievanceStatus.resolved:
        grievance.resolved_at = datetime.now(timezone.utc)
        citizen = db.query(Citizen).filter(Citizen.id == grievance.citizen_id).first()
        if citizen and citizen.phone:
            send_resolution_message(
                phone=citizen.phone,
                ticket_id=grievance.ticket_id,
                resolution_notes=status_update.remark or "Resolved by field officer.",
            )
    elif status_update.status != old_status:
        citizen = db.query(Citizen).filter(Citizen.id == grievance.citizen_id).first()
        if citizen and citizen.phone:
            send_status_update(
                phone=citizen.phone,
                ticket_id=grievance.ticket_id,
                new_status=status_update.status.value,
                remark=status_update.remark,
            )

    db.commit()
    db.refresh(grievance)
    return grievance


@router.get("/heatmap")
def get_heatmap_points(db: Session = Depends(get_db)):
    grievances = (
        db.query(Grievance)
        .filter(Grievance.lat.isnot(None), Grievance.lng.isnot(None))
        .all()
    )
    points = []
    for g in grievances:
        points.append(
            {
                "id": g.id,
                "ticket_id": g.ticket_id,
                "lat": g.lat,
                "lng": g.lng,
                "category": g.category.value,
                "status": g.status.value,
                "description": g.description[:100],
            }
        )
    return points

