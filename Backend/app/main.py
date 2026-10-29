"""
Punto de entrada de la aplicación FastAPI.

Configura:
  - CORS
  - Logging básico
  - Registro de routers
  - Endpoint /health
  - Documentación Swagger en /docs
"""
import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import citas, chat, documentos


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀  %s v%s arrancando…", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Supabase URL: %s", settings.SUPABASE_URL)
    logger.info("CORS permitido para: %s", settings.FRONTEND_URL)
    yield
    logger.info("🛑  Servidor apagándose.")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Backend liviano para el sistema de asistencia legal de Cochabamba. "
        "Gestiona citas, búsqueda legal y documentos. "
        "Seguridad delegada a Row-Level Security de Supabase."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(citas.router)
app.include_router(chat.router)
app.include_router(documentos.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
def health():
    """Verifica que el servidor está en línea."""
    return {"status": "ok", "version": settings.APP_VERSION}
