import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
# Import all models so that Base.metadata.create_all creates all tables
from app.models import citizen, scheme, grievance, eligibility_check, notification, officer
from app.models.scheme import Scheme
from app.routers import auth, schemes, grievances, chat, dashboard

logger = logging.getLogger(__name__)

_API_PREFIXES = ("/auth", "/schemes", "/grievances", "/chat", "/dashboard")


def _auto_seed_if_empty():
    """Ensure tables exist and seed initial Odisha schemes & admin user if DB is empty."""
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            is_empty = db.query(Scheme).count() == 0
        finally:
            db.close()
        if is_empty:
            from seed_data import seed
            seed()
    except Exception as e:
        logger.warning(f"Auto-init DB skipped or failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    _auto_seed_if_empty()
    try:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    except Exception as e:
        logger.warning(f"Could not create upload dir: {e}")
    yield


app = FastAPI(
    title="GraamSeva AI API — ଗ୍ରାମ ସେବା AI",
    description="Multilingual AI-powered governance and citizen service platform for Odisha.",
    version="1.0.0",
    lifespan=lifespan,
)


class PrefixNormalizerMiddleware:
    """Handle reverse proxies (such as Vercel Services mount at /api) that strip the /api prefix."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if any(path == p or path.startswith(p + "/") for p in _API_PREFIXES):
                scope["path"] = "/api" + path
        await self.app(scope, receive, send)


# Ensure DB initialized even in serverless environments where lifespan may not fire before first check
_auto_seed_if_empty()

app.add_middleware(PrefixNormalizerMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
except Exception as e:
    logger.warning(f"Skipping static uploads mount: {e}")

# Include Routers
app.include_router(auth.router)
app.include_router(schemes.router)
app.include_router(grievances.router)
app.include_router(chat.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
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
