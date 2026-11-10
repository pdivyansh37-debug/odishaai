import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
# Import all models so that Base.metadata.create_all creates all tables
from app.models import citizen, scheme, grievance, eligibility_check, notification, officer
from app.routers import auth, schemes, grievances, chat, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    # Ensure upload folder exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield


app = FastAPI(
    title="GraamSeva AI API — ଗ୍ରାମ ସେବା AI",
    description="Multilingual AI-powered governance and citizen service platform for Odisha.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(schemes.router)
app.include_router(grievances.router)
app.include_router(chat.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "service": "GraamSeva AI Backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["root"])
def root():
    return {
        "message": "Welcome to GraamSeva AI API — ଗ୍ରାମ ସେବା AI",
        "documentation": "/docs",
        "health": "/health",
    }

