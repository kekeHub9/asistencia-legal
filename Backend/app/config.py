"""
Configuración central de la aplicación.
Lee variables de entorno y expone settings.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # App
    APP_NAME: str = "Legal Backend API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False


settings = Settings()  # type: ignore[call-arg]
