from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.officer import Officer, OfficerRole
from app.schemas.auth import OfficerLogin, Token, OfficerCreate, OfficerOut
from app.utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_officer,
    require_role,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(login_data: OfficerLogin, db: Session = Depends(get_db)):
    officer = db.query(Officer).filter(Officer.email == login_data.email).first()
    if not officer or not verify_password(login_data.password, officer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not officer.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Officer account is deactivated",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(officer.id), "email": officer.email, "role": officer.role.value},
        expires_delta=access_token_expires,
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        officer_id=officer.id,
        officer_name=officer.name,
        role=officer.role,
    )


@router.get("/me", response_model=OfficerOut)
def get_me(current_officer: Officer = Depends(get_current_officer)):
    return current_officer


@router.post("/register", response_model=OfficerOut, status_code=status.HTTP_201_CREATED)
def register_officer(
    officer_in: OfficerCreate,
    db: Session = Depends(get_db),
    current_officer: Officer = Depends(require_role(OfficerRole.admin)),
):
    existing = db.query(Officer).filter(Officer.email == officer_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    officer = Officer(
        name=officer_in.name,
        email=officer_in.email,
        hashed_password=get_password_hash(officer_in.password),
        dept=officer_in.dept,
        district=officer_in.district,
        role=officer_in.role,
        is_active=True,
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer

