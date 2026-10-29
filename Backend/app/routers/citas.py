"""
Router de citas:
  GET    /api/citas                         → listar citas existentes
  POST   /api/citas                         → crear cita (verifica disponibilidad)
  PUT    /api/citas/{id}                    → actualizar estado/fecha/hora
  DELETE /api/citas/{id}                    → eliminar cita permanentemente
  GET    /api/citas/disponibilidad          → bloques libres de un abogado en una fecha
"""
import logging
from datetime import datetime, timedelta, date as date_type
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.dependencies import CurrentUser, get_current_user, get_supabase_client
from app.schemas.citas import CitaCreate, CitaOut, CitaUpdate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/citas", tags=["Citas"])

# Configuración de horario laboral
HORA_INICIO = "09:00"
HORA_FIN = "18:00"
DURACION_BLOQUE_MIN = 30


def _generar_bloques(hora_inicio: str, hora_fin: str, duracion_min: int) -> list[str]:
    """Genera bloques de tiempo en formato HH:MM entre hora_inicio y hora_fin."""
    fmt = "%H:%M"
    actual = datetime.strptime(hora_inicio, fmt)
    fin = datetime.strptime(hora_fin, fmt)
    bloques = []
    while actual < fin:
        bloques.append(actual.strftime(fmt))
        actual += timedelta(minutes=duracion_min)
    return bloques


# ---------------------------------------------------------------------------
# GET /api/citas
# ---------------------------------------------------------------------------
@router.get("")
def listar_citas(
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Retorna la lista de citas directamente desde Supabase.
    """
    try:
        resp = (
            client.table("citas")
            .select("*")
            .order("fecha", desc=False)
            .execute()
        )
        return {"citas": resp.data or [], "total": len(resp.data or [])}
    except Exception as exc:
        logger.error("Error listando citas: %s", exc)
        return {"citas": [], "total": 0}


# ---------------------------------------------------------------------------
# GET /api/citas/disponibilidad
# ---------------------------------------------------------------------------
@router.get("/disponibilidad")
def disponibilidad(
    fecha: str = Query(..., description="Fecha YYYY-MM-DD"),
    abogado_id: Optional[str] = Query(None, description="UUID del abogado"),
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Retorna los bloques horarios libres en la fecha indicada.
    Los bloques son de 30 minutos entre 09:00 y 18:00.
    """
    try:
        query = (
            client.table("citas")
            .select("hora")
            .eq("fecha", fecha)
            .neq("estado", "cancelada")
        )
        if abogado_id:
            query = query.eq("abogado_id", abogado_id)
        resp = query.execute()
    except Exception as exc:
        logger.error("Error consultando disponibilidad: %s", exc)
        raise HTTPException(status_code=500, detail="Error al consultar disponibilidad")

    ocupadas: set[str] = {row["hora"][:5] for row in (resp.data or []) if row.get("hora")}
    todos = _generar_bloques(HORA_INICIO, HORA_FIN, DURACION_BLOQUE_MIN)
    libres = [h for h in todos if h not in ocupadas]

    return {
        "abogado_id": abogado_id,
        "fecha": fecha,
        "bloques_libres": libres,
        "bloques_ocupados": sorted(ocupadas),
    }


# ---------------------------------------------------------------------------
# POST /api/citas
# ---------------------------------------------------------------------------
@router.post("", status_code=status.HTTP_201_CREATED)
def crear_cita(
    body: CitaCreate,
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Crea una cita y la persiste en Supabase.
    Retorna 409 si el horario ya está ocupado.
    """
    # 1. Verificar conflicto de horario
    try:
        query = (
            client.table("citas")
            .select("id")
            .eq("fecha", str(body.fecha))
            .eq("hora", body.hora)
            .neq("estado", "cancelada")
        )
        if body.abogado_id:
            query = query.eq("abogado_id", str(body.abogado_id))
        check = query.execute()
        if check.data:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El horario ya está ocupado. Elija otro bloque disponible.",
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.warning("Verificación de disponibilidad tolerante: %s", exc)

    # 2. Manejo seguro de Foreign Keys para evitar error Postgres 23503
    usuario_uuid = None
    user_id_candidate = getattr(current_user, "id", None) or (current_user.get("id") if isinstance(current_user, dict) else None)
    if user_id_candidate and not str(user_id_candidate).startswith("00000000"):
        try:
            prof_check = client.table("profiles").select("id").eq("id", str(user_id_candidate)).execute()
            if prof_check.data:
                usuario_uuid = str(user_id_candidate)
        except Exception:
            pass

    abogado_uuid = None
    if body.abogado_id and not str(body.abogado_id).startswith("usr-") and not str(body.abogado_id).startswith("00000000"):
        try:
            abog_check = client.table("profiles").select("id").eq("id", str(body.abogado_id)).execute()
            if abog_check.data:
                abogado_uuid = str(body.abogado_id)
        except Exception:
            pass

    # 3. Datos de la nueva cita adaptados a las columnas de Supabase
    nueva_cita = {
        "usuario_id": usuario_uuid,
        "nombre_usuario": body.nombre_usuario or "Carlos Mamani Torrico",
        "abogado_id": abogado_uuid,
        "nombre_abogado": body.nombre_abogado or "Dra. Valeria Soliz Guzmán",
        "fecha": str(body.fecha),
        "hora": body.hora,
        "motivo": body.motivo,
        "modalidad": body.modalidad or "presencial",
        "lugar": body.lugar or "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Cochabamba)",
        "materia": body.materia or "General",
        "estado": "pendiente",
        "notas": body.notas or "",
    }

    try:
        insert_resp = client.table("citas").insert(nueva_cita).execute()
    except Exception as exc:
        logger.error("Error insertando cita en Supabase: %s", exc)
        raise HTTPException(status_code=500, detail=f"Error al guardar cita: {exc}")

    if not insert_resp.data:
        raise HTTPException(status_code=500, detail="No se pudo crear la cita en Supabase")

    logger.info("Cita creada exitosamente en Supabase: %s", insert_resp.data[0])
    return insert_resp.data[0]


# ---------------------------------------------------------------------------
# PUT /api/citas/{id}
# ---------------------------------------------------------------------------
@router.put("/{cita_id}")
def actualizar_cita(
    cita_id: str,
    body: CitaUpdate,
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Actualiza el estado (ej: 'cancelada', 'confirmada') o reprograma una cita.
    """
    cambios: dict = {"estado": body.estado}
    if body.fecha is not None:
        cambios["fecha"] = str(body.fecha)
    if body.hora is not None:
        cambios["hora"] = body.hora

    try:
        resp = (
            client.table("citas")
            .update(cambios)
            .eq("id", cita_id)
            .execute()
        )
    except Exception as exc:
        logger.error("Error actualizando cita %s: %s", cita_id, exc)
        raise HTTPException(status_code=500, detail="Error al actualizar la cita")

    if not resp.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada para actualizar",
        )

    logger.info("Cita %s actualizada: %s", cita_id, cambios)
    return resp.data[0]


# ---------------------------------------------------------------------------
# DELETE /api/citas/{id}
# ---------------------------------------------------------------------------
@router.delete("/{cita_id}")
def eliminar_cita(
    cita_id: str,
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Elimina permanentemente una cita de la base de datos Supabase.
    """
    try:
        resp = client.table("citas").delete().eq("id", cita_id).execute()
        logger.info("Cita %s eliminada de Supabase", cita_id)
        return {
            "success": True,
            "detail": f"Cita {cita_id} eliminada correctamente",
            "deleted": resp.data,
        }
    except Exception as exc:
        logger.error("Error eliminando cita %s: %s", cita_id, exc)
        raise HTTPException(status_code=500, detail="Error al eliminar la cita")
