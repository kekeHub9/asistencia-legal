"""
Router de documentos.

GET /api/documentos
  Lista los documentos del usuario autenticado.
  RLS en Supabase garantiza que cada usuario solo ve sus propios documentos.
"""
import logging

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.dependencies import get_current_user, get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/documentos", tags=["Documentos"])


@router.get("")
def listar_documentos(
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Lista los documentos del usuario autenticado.
    La subida/descarga de archivos se hace directamente desde el frontend
    con Supabase Storage; este endpoint expone metadatos y permite
    lógica adicional si se necesita.
    """
    try:
        resp = (
            client.table("documentos")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        logger.error("Error listando documentos del usuario %s: %s", current_user.id, exc)
        raise HTTPException(status_code=500, detail="Error al obtener documentos")

    return {"documentos": resp.data or [], "total": len(resp.data or [])}
