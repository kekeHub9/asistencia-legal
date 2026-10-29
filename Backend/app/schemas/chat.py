"""
Schemas Pydantic para chat / búsqueda legal.
"""
from typing import Any, Optional, List
from pydantic import BaseModel, Field


class ChatBuscarRequest(BaseModel):
    mensaje: Optional[str] = Field(default=None, description="Mensaje o consulta en español")
    message: Optional[str] = Field(default=None, description="Alias para message")
    history: Optional[List[dict]] = []
    context: Optional[str] = "cochabamba_bolivia"

    @property
    def texto(self) -> str:
        return (self.mensaje or self.message or "").strip()


class ResultadoBusqueda(BaseModel):
    tipo: str          # "faq" | "guia"
    id: str
    titulo: str
    descripcion: Optional[str] = None
    relevancia: Optional[float] = None
    extra: Optional[Any] = None


class ChatBuscarResponse(BaseModel):
    resultados: list[ResultadoBusqueda] = []
    respuesta: str
    reply: Optional[str] = None
    referencias: Optional[List[str]] = []
    acciones: Optional[List[dict]] = []
