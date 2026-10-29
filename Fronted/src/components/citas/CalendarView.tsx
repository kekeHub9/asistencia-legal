"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserCitas } from "@/lib/supabase/client";
import {
  createCitaBackend,
  deleteCitaBackend,
  updateCitaStatusBackend,
} from "@/lib/api/backend-client";
import { Cita, ModalidadCita } from "@/types";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  CalendarCheck2,
  Trash2,
  Ban,
  RefreshCw,
  Database,
  Filter,
} from "lucide-react";

export function CalendarView() {
  const { user, token } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("todas");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fecha seleccionada en el calendario
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-29");

  // Formulario de nueva cita
  const [formData, setFormData] = useState<{
    materia: string;
    modalidad: ModalidadCita;
    fecha: string;
    hora: string;
    motivo: string;
    lugar: string;
    notas: string;
  }>({
    materia: "Derechos Reales e Inmuebles",
    modalidad: "presencial",
    fecha: "2026-10-30",
    hora: "10:00",
    motivo: "",
    lugar: "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Cochabamba)",
    notas: "",
  });

  const loadCitas = async () => {
    setIsLoading(true);
    try {
      const data = await getUserCitas(user?.id);
      setCitas(data);
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, [user]);

  // Manejar cambio de modalidad
  const handleModalidadChange = (mod: ModalidadCita) => {
    setFormData((prev) => ({
      ...prev,
      modalidad: mod,
      lugar:
        mod === "presencial"
          ? "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Piso 2, Cochabamba)"
          : "Videollamada Google Meet (enlace enviado por correo)",
    }));
  };

  // Crear cita consumiendo el backend FastAPI con guardado persistente en Supabase
  const handleCreateCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motivo.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await createCitaBackend({
        citaData: {
          usuarioId: user?.id || "usr-ciudadano-001",
          nombreUsuario: user?.fullName || "Carlos Mamani Torrico",
          abogadoId: "usr-abogado-002",
          nombreAbogado: "Dra. Valeria Soliz Guzmán",
          fecha: formData.fecha,
          hora: formData.hora,
          modalidad: formData.modalidad,
          lugar: formData.lugar,
          materia: formData.materia,
          motivo: formData.motivo,
          estado: "pendiente",
          notas: formData.notas,
        },
        token,
      });

      if (result.success && result.cita) {
        // Recargar desde Supabase / FastAPI para asegurar sincronización
        await loadCitas();
        setFeedback({
          type: "success",
          message: "¡Cita guardada y sincronizada exitosamente en Supabase a través de FastAPI!",
        });
        setModalOpen(false);
        setFormData({
          materia: "Derechos Reales e Inmuebles",
          modalidad: "presencial",
          fecha: "2026-10-31",
          hora: "11:00",
          motivo: "",
          lugar: "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Cochabamba)",
          notas: "",
        });
      } else {
        setFeedback({
          type: "error",
          message: result.error || "No se pudo registrar la cita en el backend.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error de conexión al procesar la cita con el backend.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar cita permanentemente (quitar citas viejas)
  const handleDeleteCita = async (citaId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta cita?")) {
      return;
    }

    setDeletingId(citaId);
    setFeedback(null);

    try {
      const res = await deleteCitaBackend({ citaId, token });
      if (res.success) {
        setCitas((prev) => prev.filter((c) => c.id !== citaId));
        setFeedback({
          type: "success",
          message: "La cita fue eliminada permanentemente de la base de datos.",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "No se pudo eliminar la cita.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Error de red al intentar eliminar la cita.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Cancelar cita (marcar como cancelada)
  const handleCancelCita = async (citaId: string) => {
    setCancellingId(citaId);
    setFeedback(null);

    try {
      const res = await updateCitaStatusBackend({
        citaId,
        estado: "cancelada",
        token,
      });

      if (res.success) {
        setCitas((prev) =>
          prev.map((c) => (c.id === citaId ? { ...c, estado: "cancelada" } : c))
        );
        setFeedback({
          type: "success",
          message: "La cita ha sido marcada como cancelada.",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "No se pudo cancelar la cita.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Error al actualizar el estado de la cita.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Días del mes para el calendario (Octubre 2026)
  const daysInMonth = 31;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filtrado de citas según la pestaña seleccionada
  const filteredCitas = citas.filter((c) => {
    if (filterEstado === "todas") return true;
    return c.estado === filterEstado;
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmada
          </span>
        );
      case "pendiente":
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Pendiente
          </span>
        );
      case "cancelada":
        return (
          <span className="bg-red-100 text-red-800 border border-red-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Ban className="w-3 h-3 text-red-600" />
            Cancelada
          </span>
        );
      case "completada":
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            Completada
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-full">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior con Acciones e Indicador de Sincronización */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Agenda de Asesoría Legal
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-600" />
              Sincronizado Supabase
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Agenda tu cita con abogados especialistas en Cochabamba. Los cambios se guardan en la base de datos y no desaparecen al refrescar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCitas()}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="Recargar citas de la base de datos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Nueva Cita</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Principal: Calendario a la izquierda, Citas a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendario Mensual (7 columnas) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Octubre 2026
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Zona horaria: Bolivia (UTC-4)
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div className="text-amber-600">Sáb</div>
            <div className="text-red-500">Dom</div>
          </div>

          {/* Días del mes en grilla */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            <div className="h-10 sm:h-12 border border-transparent"></div>
            <div className="h-10 sm:h-12 border border-transparent"></div>
            <div className="h-10 sm:h-12 border border-transparent"></div>

            {calendarDays.map((day) => {
              const dateStr = `2026-10-${day < 10 ? "0" + day : day}`;
              const hasCita = citas.some((c) => c.fecha === dateStr && c.estado !== "cancelada");
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                      : hasCita
                      ? "bg-blue-50 text-blue-800 border-blue-200 font-semibold"
                      : "hover:bg-slate-100 text-slate-700 border-slate-100"
                  }`}
                >
                  <span>{day}</span>
                  {hasCita && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected ? "bg-white" : "bg-blue-600"
                      }`}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Días con citas activas</span>
            </div>
            <span className="text-[11px] italic">
              Atención presencial: Lun a Vie 08:30 - 16:30
            </span>
          </div>
        </div>

        {/* Listado de Citas con Pestañas y Acciones para Quitar Citas Viejas (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tus Citas Registradas
              </h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {filteredCitas.length} mostradas
            </span>
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 text-xs overflow-x-auto">
            {["todas", "pendiente", "confirmada", "cancelada"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterEstado(st)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  filterEstado === st
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Listado de Citas */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pt-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Sincronizando citas con Supabase y FastAPI...
              </div>
            ) : filteredCitas.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No hay citas en este estado.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Agendar una nueva cita
                </button>
              </div>
            ) : (
              filteredCitas.map((cita) => (
                <div
                  key={cita.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    cita.estado === "cancelada"
                      ? "border-red-100 bg-red-50/30 opacity-75"
                      : "border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {cita.materia}
                    </span>
                    {getStatusBadge(cita.estado)}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cita.motivo}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-blue-600" />
                      <span>{cita.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{cita.hora}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 truncate">
                      {cita.modalidad === "presencial" ? (
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      ) : (
                        <Video className="w-3 h-3 text-purple-600 shrink-0" />
                      )}
                      <span className="truncate">{cita.lugar}</span>
                    </div>
                  </div>

                  {cita.nombreAbogado && (
                    <div className="pt-1 text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Abog. asignado: {cita.nombreAbogado}</span>
                    </div>
                  )}

                  {/* Botones de acción: Quitar o Cancelar Citas */}
                  <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-end gap-2">
                    {cita.estado !== "cancelada" && (
                      <button
                        onClick={() => handleCancelCita(cita.id)}
                        disabled={cancellingId === cita.id}
                        className="px-2.5 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
                        title="Marcar cita como cancelada"
                      >
                        <Ban className="w-3 h-3" />
                        <span>{cancellingId === cita.id ? "Cancelando..." : "Cancelar"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteCita(cita.id)}
                      disabled={deletingId === cita.id}
                      className="px-2.5 py-1 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 flex items-center gap-1 transition-colors"
                      title="Eliminar permanentemente de la base de datos"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{deletingId === cita.id ? "Eliminando..." : "Eliminar"}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para Agendar Nueva Cita (Envía POST a FastAPI) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Agendar Cita Jurídica (FastAPI & Supabase)
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCita} className="space-y-4 text-xs sm:text-sm">
              {/* Materia del trámite */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Materia o Área del Trámite *
                </label>
                <select
                  value={formData.materia}
                  onChange={(e) =>
                    setFormData({ ...formData, materia: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Derechos Reales e Inmuebles">
                    Derechos Reales e Inmuebles (Folio Real, Compraventa)
                  </option>
                  <option value="Asistencia Familiar">
                    Asistencia Familiar y Derecho de Familia
                  </option>
                  <option value="Licencia de Funcionamiento GAMC">
                    Licencia de Funcionamiento y Catastro (Alcaldía)
                  </option>
                  <option value="SERECI / Partidas y Certificados">
                    SERECI / Corrección de Partidas de Nacimiento
                  </option>
                  <option value="Divorcio Notarial o Judicial">
                    Divorcio Notarial por Mutuo Acuerdo
                  </option>
                </select>
              </div>

              {/* Modalidad: Presencial o Virtual */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Modalidad de Atención
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleModalidadChange("presencial")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.modalidad === "presencial"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Presencial (Cochabamba)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModalidadChange("virtual")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.modalidad === "virtual"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Virtual (Google Meet)</span>
                  </button>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha de la cita *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Horario disponible *
                  </label>
                  <select
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData({ ...formData, hora: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Motivo o Descripción en lenguaje claro */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción o Motivo de la Consulta *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.motivo}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo: e.target.value })
                  }
                  placeholder="Explica brevemente tu caso (ej: Necesito que revisen la minuta de compraventa antes de pagar el IMT en la alcaldía)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Dirección o Enlace */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ubicación o Vía
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.lugar}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs transition-all shadow-xs"
                >
                  {isSubmitting ? "Guardando en Supabase..." : "Confirmar y Guardar Cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
