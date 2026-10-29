"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminUsersBackend,
  updateUserRoleBackend,
  saveGuiaBackend,
  getAuditLogsBackend,
} from "@/lib/api/backend-client";
import { getGuiasVisuales } from "@/lib/supabase/client";
import { UserProfile, UserRole, GuiaVisual, AuditLog } from "@/types";
import {
  ShieldAlert,
  Users,
  Compass,
  History,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  Eye,
  Search,
  Filter,
  X,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  const { role, token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"usuarios" | "guias" | "auditoria">("usuarios");

  // Estados de datos
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [guias, setGuias] = useState<GuiaVisual[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal para nueva guía
  const [modalNewGuiaOpen, setModalNewGuiaOpen] = useState(false);
  const [newGuiaForm, setNewGuiaForm] = useState({
    titulo: "",
    slug: "",
    categoria: "inmuebles",
    entidadResponsable: "Gobierno Autónomo Municipal de Cochabamba",
    ubicacionSede: "Plaza Colón, Cochabamba",
    duracionEstimada: "10 días hábiles",
    costoTotalAproximadoBs: 100,
    dificultad: "Media",
    descripcionCorta: "",
    requisitosGenerales: "Cédula de Identidad,Formulario Municipal",
  });

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [u, g, a] = await Promise.all([
        getAdminUsersBackend(token),
        getGuiasVisuales(),
        getAuditLogsBackend(token),
      ]);
      setUsers(u);
      setGuias(g);
      setAuditLogs(a);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRoleBackend({ userId, role: newRole, token });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setMessage({
        type: "success",
        text: `Rol de usuario actualizado a ${newRole} en backend FastAPI.`,
      });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Error al actualizar el rol de usuario.",
      });
    }
  };

  const handleCreateGuia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuiaForm.titulo.trim()) return;

    try {
      const nuevaGuia: Partial<GuiaVisual> = {
        id: `guia-${Date.now().toString().slice(-4)}`,
        slug: newGuiaForm.slug || newGuiaForm.titulo.toLowerCase().replace(/\s+/g, "-"),
        titulo: newGuiaForm.titulo,
        descripcionCorta: newGuiaForm.descripcionCorta,
        descripcionLarga: newGuiaForm.descripcionCorta,
        categoria: newGuiaForm.categoria as any,
        entidadResponsable: newGuiaForm.entidadResponsable,
        ubicacionSede: newGuiaForm.ubicacionSede,
        duracionEstimada: newGuiaForm.duracionEstimada,
        costoTotalAproximadoBs: Number(newGuiaForm.costoTotalAproximadoBs),
        dificultad: newGuiaForm.dificultad as any,
        destacado: false,
        publicado: true,
        requisitosGenerales: newGuiaForm.requisitosGenerales.split(",").map((r) => r.trim()),
        pasos: [
          {
            numero: 1,
            titulo: "Revisión Inicial de Documentos",
            resumenSimple: "Presentación de fotocopias y requisitos básicos en ventanilla.",
            detalleLegal: "Verificación formal de personería e idoneidad probatoria.",
            entidad: newGuiaForm.entidadResponsable,
            duracionEstimada: "1 día",
            costoBs: 20,
            requisitosClave: ["Cédula de Identidad vigente", "Formulario único"],
          },
        ],
        flujoDiagrama: {
          nodes: [
            {
              id: "n-1",
              position: { x: 200, y: 0 },
              data: {
                label: "Inicio de Solicitud",
                tipo: "inicio",
                description: "Ingreso en ventanilla única",
              },
            },
            {
              id: "n-2",
              position: { x: 200, y: 150 },
              data: {
                label: "Resolución y Emisión",
                tipo: "fin",
                description: "Entrega del trámite concluido",
              },
            },
          ],
          edges: [{ id: "e-1-2", source: "n-1", target: "n-2", animated: true }],
        },
        faq: [],
      };

      await saveGuiaBackend({ guia: nuevaGuia, token });
      setGuias((prev) => [nuevaGuia as GuiaVisual, ...prev]);
      setModalNewGuiaOpen(false);
      setMessage({
        type: "success",
        text: "¡Nueva guía visual registrada y publicada exitosamente!",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Error al registrar la guía en el backend.",
      });
    }
  };

  if (role !== "administrador") {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-amber-200 text-center shadow-xs">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Acceso Restringido al Administrador</h2>
        <p className="text-xs text-slate-600 mt-2">
          Esta vista está reservada para el rol <strong>administrador</strong>. Puedes cambiar tu rol de prueba en la barra de navegación superior para explorar el panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera del Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <h2 className="text-xl font-bold text-slate-900">
              Panel de Administración y Control
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de usuarios y roles, catálogo de guías visuales y logs de auditoría del sistema legal.
          </p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "usuarios"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuarios ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("guias")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "guias"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guías ({guias.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("auditoria")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "auditoria"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Auditoría ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* PESTAÑA 1: GESTIÓN DE USUARIOS Y ROLES */}
      {activeTab === "usuarios" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Usuarios Registrados y Asignación de Roles (FastAPI)</span>
            </h3>
            <span className="text-xs text-slate-500">
              Permite promover ciudadanos a abogados o administradores
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Usuario</th>
                  <th className="py-2.5 px-3">Cédula / Ubicación</th>
                  <th className="py-2.5 px-3">Rol Actual</th>
                  <th className="py-2.5 px-3">Cambiar Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{usr.fullName}</div>
                      <div className="text-slate-400 text-[11px]">{usr.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{usr.ci || "Sin registrar"}</div>
                      <div className="text-[11px] text-slate-400">Cochabamba</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                          usr.role === "administrador"
                            ? "bg-purple-100 text-purple-800"
                            : usr.role === "abogado"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={usr.role}
                        onChange={(e) =>
                          handleRoleChange(usr.id, e.target.value as UserRole)
                        }
                        className="px-2 py-1 rounded-lg border border-slate-300 text-slate-800 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ciudadano">Ciudadano</option>
                        <option value="abogado">Abogado</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: CRUD DE GUÍAS VISUALES */}
      {activeTab === "guias" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Catálogo y Edición de Guías Visuales</span>
            </h3>
            <button
              onClick={() => setModalNewGuiaOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Guía</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Título de la Guía</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Entidad Responsable</th>
                  <th className="py-2.5 px-3">Pasos</th>
                  <th className="py-2.5 px-3">Costo Aprox.</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guias.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {g.titulo}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-semibold text-slate-600">
                      {g.categoria}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      {g.entidadResponsable}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {g.pasos.length} pasos
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      Bs. {g.costoTotalAproximadoBs}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                        Publicado
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/guias/${g.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: REGISTRO DE AUDITORÍA */}
      {activeTab === "auditoria" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <span>Registro de Auditoría de Operaciones</span>
            </h3>
            <span className="text-xs text-slate-500">
              Trazabilidad de accesos, consultas y trámites
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Fecha / Hora</th>
                  <th className="py-2.5 px-3">Usuario</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Módulo</th>
                  <th className="py-2.5 px-3">Detalle del Evento</th>
                  <th className="py-2.5 px-3">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {log.fecha}
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-slate-800">
                      <div>{log.usuario}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {log.rol}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {log.accion}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-700">
                      {log.modulo}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-600 max-w-xs">
                      {log.detalles}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[10px]">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Crear Nueva Guía */}
      {modalNewGuiaOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Crear Nueva Guía Visual de Trámite
              </h3>
              <button
                onClick={() => setModalNewGuiaOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuia} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título del Trámite *
                </label>
                <input
                  type="text"
                  required
                  value={newGuiaForm.titulo}
                  onChange={(e) =>
                    setNewGuiaForm({ ...newGuiaForm, titulo: e.target.value })
                  }
                  placeholder="Ej: Trámite de Autorización de Obras (Alcaldía)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newGuiaForm.categoria}
                    onChange={(e) =>
                      setNewGuiaForm({ ...newGuiaForm, categoria: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inmuebles">Inmuebles</option>
                    <option value="familia">Familia</option>
                    <option value="municipal">Municipal (GAMC)</option>
                    <option value="identidad">Identidad (SERECI)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Costo Estimado (Bs.)
                  </label>
                  <input
                    type="number"
                    value={newGuiaForm.costoTotalAproximadoBs}
                    onChange={(e) =>
                      setNewGuiaForm({
                        ...newGuiaForm,
                        costoTotalAproximadoBs: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Entidad Responsable en Cochabamba
                </label>
                <input
                  type="text"
                  value={newGuiaForm.entidadResponsable}
                  onChange={(e) =>
                    setNewGuiaForm({
                      ...newGuiaForm,
                      entidadResponsable: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción en Lenguaje Ciudadano
                </label>
                <textarea
                  rows={2}
                  value={newGuiaForm.descripcionCorta}
                  onChange={(e) =>
                    setNewGuiaForm({
                      ...newGuiaForm,
                      descripcionCorta: e.target.value,
                    })
                  }
                  placeholder="Explica para qué sirve el trámite sin jerga legal..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNewGuiaOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Guardar y Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
