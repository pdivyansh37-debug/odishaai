from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.scheme import Scheme
from app.models.citizen import Citizen
from app.models.eligibility_check import EligibilityCheck
from app.schemas.scheme import SchemeOut, EligibilityRequest, EligibilityResponse
from app.services.eligibility_service import check_eligibility

router = APIRouter(prefix="/api/schemes", tags=["schemes"])


@router.get("", response_model=List[SchemeOut])
def list_schemes(
    dept: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
):
    query = db.query(Scheme).filter(Scheme.is_active == is_active)
    if dept:
        query = query.filter(Scheme.dept.ilike(f"%{dept}%"))
    return query.all()


@router.get("/search", response_model=List[SchemeOut])
def search_schemes(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    term = f"%{q}%"
    schemes = (
        db.query(Scheme)
        .filter(
            (Scheme.name_odia.ilike(term))
            | (Scheme.name_en.ilike(term))
            | (Scheme.benefits.ilike(term))
            | (Scheme.dept.ilike(term))
        )
        .all()
    )
    return schemes


@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {scheme_id} not found",
        )
    return scheme


@router.post("/check-eligibility", response_model=EligibilityResponse)
def evaluate_eligibility(
    criteria: EligibilityRequest,
    phone: Optional[str] = None,
    db: Session = Depends(get_db),
):
    matched_schemes = check_eligibility(criteria.dict(), db)

    # If phone is provided, record this eligibility check against citizen
    if phone:
        citizen = db.query(Citizen).filter(Citizen.phone == phone).first()
        if not citizen:
            citizen = Citizen(
                phone=phone,
                district=criteria.district,
                profile_json=criteria.dict(),
            )
            db.add(citizen)
            db.commit()
            db.refresh(citizen)

        check_record = EligibilityCheck(
            citizen_id=citizen.id,
            schemes_matched=matched_schemes,
            input_data_json=criteria.dict(),
        )
        db.add(check_record)
        db.commit()

    summary_parts = [
        f"Age: {criteria.age}",
        f"Income: ₹{criteria.income:,.0f}",
        f"Caste: {criteria.caste}",
        f"Land: {criteria.land_holding} acres",
        f"Occupation: {criteria.occupation}",
    ]

    return EligibilityResponse(
        matched_schemes=matched_schemes,
        total_found=len(matched_schemes),
        input_summary=" | ".join(summary_parts),
    )

