"""
Dependencias reutilizables de FastAPI.

get_current_user:
  Lee el header Authorization, valida el JWT contra Supabase Auth y
  retorna el usuario autenticado. Las rutas protegidas usan
  Depends(get_current_user).

get_supabase_client:
  Crea un cliente Supabase con el token del usuario para que RLS se
  aplique con la identidad correcta.
"""
from typing import Annotated
import logging

from fastapi import Depends, Header, HTTPException, status
from supabase import Client, create_client

from app.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

class UserWrapper:
    def __init__(self, id_val: str, email_val: str):
        self.id = id_val
        self.email = email_val
        self.user_metadata = {"full_name": "Carlos Mamani Torrico"}


def _extract_token(authorization: str) -> str:
    """Extrae el token del header 'Authorization: Bearer <token>'."""
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de autorización inválido. Use: Bearer <token>",
        )
    return parts[1]


# ---------------------------------------------------------------------------
# Dependencias
# ---------------------------------------------------------------------------

def get_supabase_client(
    authorization: Annotated[str, Header(alias="Authorization")],
) -> Client:
    """
    Crea un cliente Supabase autenticado con el JWT del frontend.
    RLS se aplica automáticamente con la identidad del usuario.
    """
    token = _extract_token(authorization)
    client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    # Solo inyectar auth si es un token JWT real de Supabase
    if not token.startswith("demo-") and not token.startswith("demo_"):
        try:
            client.postgrest.auth(token)
        except Exception as e:
            logger.warning("No se pudo inyectar token en postgrest: %s", e)
    return client


def get_current_user(
    authorization: Annotated[str, Header(alias="Authorization")],
) -> dict:
    """
    Valida el JWT con Supabase Auth y retorna el objeto user.
    Permite tokens de demostración para desarrollo.
    """
    token = _extract_token(authorization)

    # Soporte para modo de pruebas / desarrollo sin credenciales OAuth
    if token.startswith("demo-") or token.startswith("demo_"):
        return UserWrapper(
            id_val="00000000-0000-0000-0000-000000000001",
            email_val="ciudadano.cochabamba@gmail.com",
        )

    # Cliente para verificar con Supabase Auth
    anon_client: Client = create_client(
        settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY
    )
    try:
        response = anon_client.auth.get_user(token)
        if response is None or response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado",
            )
        return response.user
    except Exception as exc:
        # Fallback de desarrollo si falla la validación
        if settings.DEBUG or token.startswith("demo"):
            return UserWrapper(
                id_val="00000000-0000-0000-0000-000000000001",
                email_val="ciudadano.cochabamba@gmail.com",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        ) from exc


# Tipos anotados para inyección limpia en rutas
CurrentUser = Annotated[dict, Depends(get_current_user)]
SupabaseClient = Annotated[Client, Depends(get_supabase_client)]
