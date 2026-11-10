from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/graamseva"

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # Twilio WhatsApp
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"

    # JWT Auth
    SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # App
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Upload path
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def mock_whatsapp(self) -> bool:
        """Use mock mode if Twilio credentials not set."""
        return not self.TWILIO_ACCOUNT_SID or self.TWILIO_ACCOUNT_SID == "your_twilio_sid"

    @property
    def mock_gemini(self) -> bool:
        """Use mock mode if Gemini key not set."""
        return not self.GEMINI_API_KEY or self.GEMINI_API_KEY == "your_gemini_api_key_here"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
