"""
Router de chat / búsqueda legal.

Endpoints:
  POST /api/chat
  POST /api/chat/buscar
    - Busca en las tablas faq_legal y guias_visuales.
    - Soporta respuestas jurídicas contextualizadas de Cochabamba.
    - Guarda el mensaje y la respuesta en la tabla conversaciones si existe.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.dependencies import get_current_user, get_supabase_client
from app.schemas.chat import ChatBuscarRequest, ChatBuscarResponse, ResultadoBusqueda

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat / Búsqueda Legal"])

RESPUESTA_SIN_RESULTADO = (
    "No encontré una respuesta exacta para ese término. "
    "Te sugiero revisar nuestras Guías Visuales o agendar una cita con un abogado especialista en Cochabamba."
)
MAX_RESULTADOS = 10


def _buscar_faq(client: Client, terminos: str) -> list[dict]:
    """Busca en faq_legal con full-text search usando columna 'palabras_clave'."""
    try:
        resp = (
            client.table("faq_legal")
            .select("id, titulo, descripcion, palabras_clave, categoria")
            .text_search("palabras_clave", terminos)
            .limit(MAX_RESULTADOS)
            .execute()
        )
        if resp.data:
            return [{"tipo": "faq", **r} for r in resp.data]
    except Exception:
        pass

    try:
        resp = (
            client.table("faq_legal")
            .select("id, titulo, descripcion, palabras_clave, categoria")
            .ilike("titulo", f"%{terminos}%")
            .limit(MAX_RESULTADOS)
            .execute()
        )
        return [{"tipo": "faq", **r} for r in (resp.data or [])]
    except Exception as exc:
        logger.warning("Error buscando en faq_legal: %s", exc)
        return []


def _buscar_guias(client: Client, terminos: str) -> list[dict]:
    """Busca en guias_visuales con ILIKE."""
    try:
        resp = (
            client.table("guias_visuales")
            .select("id, titulo, descripcion_corta, descripcion_larga, categoria, entidad_responsable")
            .ilike("titulo", f"%{terminos}%")
            .limit(MAX_RESULTADOS)
            .execute()
        )
        if resp.data:
            return [
                {
                    "tipo": "guia",
                    "id": r.get("id"),
                    "titulo": r.get("titulo"),
                    "descripcion": r.get("descripcion_corta") or r.get("descripcion_larga"),
                    "categoria": r.get("categoria"),
                    "entidad_responsable": r.get("entidad_responsable"),
                }
                for r in resp.data
            ]
    except Exception as exc:
        logger.warning("Error buscando guías por título: %s", exc)

    return []


def _guardar_conversacion(
    client: Client,
    user_id: str,
    mensaje: str,
    respuesta: str,
    resultados_count: int,
) -> None:
    """Persiste el intercambio en la tabla conversaciones (opcional)."""
    try:
        client.table("conversaciones").insert(
            {
                "usuario_id": user_id if not str(user_id).startswith("00000000") else None,
                "mensaje_usuario": mensaje,
                "respuesta_bot": respuesta,
                "resultados_encontrados": resultados_count,
            }
        ).execute()
    except Exception as exc:
        logger.warning("No se pudo guardar la conversación en Supabase: %s", exc)


@router.post("", response_model=ChatBuscarResponse)
@router.post("/buscar", response_model=ChatBuscarResponse)
def procesar_chat(
    body: ChatBuscarRequest,
    current_user: dict = Depends(get_current_user),
    client: Client = Depends(get_supabase_client),
):
    """
    Endpoint de chat unificado para responder consultas jurídicas y buscar en guías/faqs.
    """
    terminos = body.texto
    if not terminos:
        return ChatBuscarResponse(
            respuesta="Por favor escribe tu consulta jurídica para que pueda orientarte.",
            reply="Por favor escribe tu consulta jurídica para que pueda orientarte.",
            resultados=[],
        )

    lower = terminos.lower()

    # Búsqueda en base de datos
    faqs = _buscar_faq(client, terminos)
    guias = _buscar_guias(client, terminos)

    todos: list[ResultadoBusqueda] = []
    for item in faqs + guias:
        todos.append(
            ResultadoBusqueda(
                tipo=item.get("tipo", "guia"),
                id=str(item.get("id", "")),
                titulo=item.get("titulo", "Sin título"),
                descripcion=item.get("descripcion"),
                extra={
                    k: v
                    for k, v in item.items()
                    if k not in {"tipo", "id", "titulo", "descripcion"}
                },
            )
        )

    referencias: List[str] = []
    acciones: List[dict] = []

    # Respuestas jurídicas asistidas para Cochabamba
    if "derechos reales" in lower or "folio" in lower or "inmueble" in lower or "compraventa" in lower:
        respuesta = (
            "Para tramitar la inscripción en Derechos Reales (DDRR) Cochabamba (Av. Heroínas esq. San Martín):\n\n"
            "1. Minuta y Testimonio Notarial: Formaliza la compraventa ante Notario de Fe Pública.\n"
            "2. Impuesto Municipal IMT: Paga el 3% en Recaudaciones del GAMC (Plaza Colón o Subalcaldías).\n"
            "3. Ingreso en Ventanilla DDRR: Presenta el Testimonio, Formulario IMT, Plano visado y Cédula de Identidad.\n"
            "4. Retiro del Folio Real: En un plazo aproximado de 10 a 15 días hábiles con el talón de ingreso."
        )
        referencias = [
            "Código Civil Boliviano (Art. 491 y 1538)",
            "Ley de Inscripción de Derechos Reales",
            "Normativa de Catastro GAMC Cochabamba",
        ]
        acciones = [
            {"texto": "Ver Guía Visual de Derechos Reales", "ruta": "/guias/guia-ddrr-compraventa"},
            {"texto": "Agendar Asesoría Presencial", "ruta": "/citas"},
        ]
    elif "asistencia" in lower or "pension" in lower or "hijo" in lower or "manutencion" in lower:
        respuesta = (
            "En Bolivia, la Asistencia Familiar se rige por el Código de las Familias (Ley 603):\n\n"
            "- Monto Mínimo: 20% del Salario Mínimo Nacional por cada hijo.\n"
            "- Competencia: Juzgados Públicos de Familia en el Tribunal Departamental de Justicia (calle Jordán y San Martín).\n"
            "- Medida Cautelar: El Juez fija un monto provisional desde el primer decreto.\n"
            "- Depósitos: Obligatoriamente en cuenta judicial del Banco Unión."
        )
        referencias = [
            "Ley 603 (Código de las Familias, Arts. 109 - 127)",
            "Constitución Política del Estado (Art. 64)",
        ]
        acciones = [
            {"texto": "Consultar Guía de Asistencia Familiar", "ruta": "/guias/guia-asistencia-familiar"},
            {"texto": "Agendar Cita con Abogado", "ruta": "/citas"},
        ]
    elif todos:
        items_txt = "\n".join([f"- **{it.titulo}**: {it.descripcion or ''}" for it in todos[:3]])
        respuesta = (
            f"Encontré {len(todos)} trámite(s) relacionado(s) en la base de Cochabamba:\n\n{items_txt}"
        )
        referencias = ["Guías de Atención al Ciudadano de Cochabamba"]
        acciones = [{"texto": "Ver Todas las Guías", "ruta": "/guias"}]
    else:
        respuesta = (
            f"Sobre '{terminos}': Te recomiendo consultar nuestra sección de Guías Visuales "
            "o agendar una cita directa con nuestros abogados en Cochabamba para revisar tu caso."
        )
        referencias = ["Constitución Política del Estado Plurinacional de Bolivia"]
        acciones = [
            {"texto": "Explorar Catálogo de Guías", "ruta": "/guias"},
            {"texto": "Agendar Cita de Orientación", "ruta": "/citas"},
        ]

    # Guardar conversación
    user_id = getattr(current_user, "id", None) or "anon"
    _guardar_conversacion(
        client,
        user_id=str(user_id),
        mensaje=terminos,
        respuesta=respuesta,
        resultados_count=len(todos),
    )

    return ChatBuscarResponse(
        resultados=todos,
        respuesta=respuesta,
        reply=respuesta,
        referencias=referencias,
        acciones=acciones,
    )
