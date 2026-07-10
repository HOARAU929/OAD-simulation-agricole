"""Application configuration"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    app_name: str = "OAD Simulation Agricole"
    debug: bool = True
    database_url: str = "sqlite:///./test.db"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get application settings"""
    return Settings()


settings = get_settings()