import os
from datetime import timedelta
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Config:
    """Base Configuration"""
    SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-secret-key")
    
    # Database
    # Support PostgreSQL URL prefixes like postgres:// or postgresql://
    database_url = os.getenv("DATABASE_URL", "sqlite:///portfolio_cms.db")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret-key")
    jwt_access_hours = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 2))
    jwt_refresh_days = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=jwt_access_hours)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=jwt_refresh_days)

    # CORS
    raw_cors = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:5174")
    CORS_ORIGINS = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

    # Media Upload Folder (Relative to project)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
