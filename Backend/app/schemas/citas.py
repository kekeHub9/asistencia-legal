"""
Schemas Pydantic para citas.
"""
from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel, Field


class CitaCreate(BaseModel):
    abogado_id: Optional[str] = Field(default=None, description="UUID del abogado")
    nombre_abogado: Optional[str] = Field(default=None, description="Nombre del abogado")
    nombre_usuario: Optional[str] = Field(default=None, description="Nombre del ciudadano")
    fecha: date = Field(..., description="Fecha de la cita (YYYY-MM-DD)")
    hora: str = Field(..., pattern=r"^\d{2}:\d{2}", description="Hora HH:MM")
    motivo: str = Field(..., min_length=3, max_length=500)
    modalidad: Optional[str] = Field(default="presencial", description="presencial o virtual")
    lugar: Optional[str] = Field(default="Oficina Jurídica - Cochabamba")
    materia: Optional[str] = Field(default="General")
    notas: Optional[str] = None


class CitaUpdate(BaseModel):
    estado: Literal["pendiente", "confirmada", "completada", "cancelada"]
    fecha: Optional[date] = None
    hora: Optional[str] = Field(
        default=None, pattern=r"^\d{2}:\d{2}"
    )


class CitaOut(BaseModel):
    id: str
    usuario_id: Optional[str] = None
    abogado_id: Optional[str] = None
    fecha: date
    hora: str
    motivo: str
    estado: str

    model_config = {"from_attributes": True}
