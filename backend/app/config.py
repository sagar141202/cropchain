from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGODB_URI: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    GROQ_API_KEY: str
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
