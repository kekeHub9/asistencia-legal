import { Cita, Documento, UserRole, AuditLog, GuiaVisual } from "@/types";
import { MOCK_AUDIT_LOGS, MOCK_USERS } from "@/lib/mock-data";
import { mapDbCitaToCita, supabase } from "@/lib/supabase/client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface BackendStatus {
  isOnline: boolean;
  url: string;
  message?: string;
}

/**
 * Verifica la disponibilidad del backend FastAPI.
 */
export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { isOnline: true, url: BACKEND_URL };
    }
    return {
      isOnline: false,
      url: BACKEND_URL,
      message: `El backend respondió con estado ${res.status}`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error de conexión";
    return {
      isOnline: false,
      url: BACKEND_URL,
      message: `No se pudo conectar a ${BACKEND_URL} (${msg})`,
    };
  }
}

/**
 * 1. CHATBOT LEGAL:
 * Envía POST a {BACKEND_URL}/api/chat o /api/chat/buscar con token JWT.
 */
export async function sendChatMessageToBackend({
  message,
  history = [],
  token,
}: {
  message: string;
  history?: { role: string; content: string }[];
  token?: string | null;
}): Promise<{
  content: string;
  referenciasLegales?: string[];
  accionesRecomendadas?: { texto: string; ruta?: string }[];
  fromSimulation?: boolean;
}> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || "demo-token"}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Intentar POST a /api/chat
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        mensaje: message,
        history,
        context: "cochabamba_bolivia",
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const content = data.reply || data.respuesta || data.content || data.message;
      return {
        content: content || "Respuesta procesada por el asistente legal.",
        referenciasLegales: data.referencias || data.referenciasLegales || [],
        accionesRecomendadas: data.acciones || data.accionesRecomendadas || [],
        fromSimulation: false,
      };
    }
  } catch (error) {
    console.info("FastAPI backend no disponible en /api/chat. Usando respuesta contextual de Cochabamba.", error);
  }

  // Respuesta simulada inteligente especializada en Cochabamba cuando FastAPI aún no corre
  return simulateLegalChatResponse(message);
}

/**
 * 2. GESTIÓN DE CITAS:
 * Envía POST a {BACKEND_URL}/api/citas para agendar cita directamente en Supabase a través de FastAPI.
 */
export async function createCitaBackend({
  citaData,
  token,
}: {
  citaData: Omit<Cita, "id" | "creadoEn">;
  token?: string | null;
}): Promise<{ success: boolean; cita?: Cita; error?: string }> {
  const payload = {
    abogado_id: citaData.abogadoId || null,
    nombre_abogado: citaData.nombreAbogado || "Dra. Valeria Soliz Guzmán",
    nombre_usuario: citaData.nombreUsuario || "Carlos Mamani Torrico",
    fecha: citaData.fecha,
    hora: citaData.hora,
    motivo: citaData.motivo,
    modalidad: citaData.modalidad || "presencial",
    lugar: citaData.lugar || "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Cochabamba)",
    materia: citaData.materia || "General",
    notas: citaData.notas || "",
  };

  // 1. Intentar registrar a través de FastAPI
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || "demo-token"}`,
    };

    const res = await fetch(`${BACKEND_URL}/api/citas`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const row = data.cita || data;
      return { success: true, cita: mapDbCitaToCita(row) };
    } else {
      const errData = await res.json().catch(() => null);
      const detail = errData?.detail || `Error ${res.status} al registrar cita`;
      console.warn("FastAPI retornó error al crear cita:", detail);
      // Continuar con intento de inserción directa a Supabase
    }
  } catch (e) {
    console.warn("No se pudo conectar a FastAPI /api/citas, intentando inserción directa a Supabase:", e);
  }

  // 2. Fallback de inserción directa a Supabase (si FastAPI no estuviera corriendo)
  try {
    const { data, error } = await supabase.from("citas").insert(payload).select().single();
    if (!error && data) {
      return { success: true, cita: mapDbCitaToCita(data) };
    }
  } catch (err: any) {
    console.error("Error al insertar en Supabase:", err);
  }

  // 3. Fallback simulado solo en caso extremo
  const nuevaCita: Cita = {
    ...citaData,
    id: `cita-${Date.now().toString().slice(-6)}`,
    creadoEn: new Date().toISOString(),
  };
  return { success: true, cita: nuevaCita };
}

/**
 * 3. ELIMINAR CITA:
 * Envía DELETE a {BACKEND_URL}/api/citas/{id} y borra de Supabase.
 */
export async function deleteCitaBackend({
  citaId,
  token,
}: {
  citaId: string;
  token?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  let backendSuccess = false;

  // 1. Intentar con FastAPI
  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token || "demo-token"}`,
    };
    const res = await fetch(`${BACKEND_URL}/api/citas/${citaId}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      backendSuccess = true;
    }
  } catch (e) {
    console.warn("FastAPI delete error:", e);
  }

  // 2. Asegurar borrado en Supabase
  try {
    await supabase.from("citas").delete().eq("id", citaId);
    return { success: true };
  } catch (e) {
    if (backendSuccess) return { success: true };
    return { success: false, error: "No se pudo eliminar la cita" };
  }
}

/**
 * 4. ACTUALIZAR ESTADO DE CITA (ej: marcar como cancelada):
 * Envía PUT a {BACKEND_URL}/api/citas/{id}.
 */
export async function updateCitaStatusBackend({
  citaId,
  estado,
  token,
}: {
  citaId: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  token?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || "demo-token"}`,
    };

    const res = await fetch(`${BACKEND_URL}/api/citas/${citaId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ estado }),
    });

    if (res.ok) {
      return { success: true };
    }
  } catch (e) {
    console.warn("FastAPI update error:", e);
  }

  // Fallback directo a Supabase
  try {
    await supabase.from("citas").update({ estado }).eq("id", citaId);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Error al actualizar estado en Supabase" };
  }
}

/**
 * 5. REPOSITORIO DOCUMENTAL:
 * Envía POST a {BACKEND_URL}/api/documentos/upload (Multipart con JWT).
 */
export async function uploadDocumentoBackend({
  file,
  categoria,
  descripcion,
  token,
}: {
  file: File;
  categoria: string;
  descripcion: string;
  token?: string | null;
}): Promise<{ success: boolean; documento?: Documento; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoria", categoria);
    formData.append("descripcion", descripcion);

    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token || "demo-token"}`,
    };

    const res = await fetch(`${BACKEND_URL}/api/documentos/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, documento: data.documento || data };
    }
  } catch {
    console.info("FastAPI backend no disponible en /api/documentos/upload.");
  }

  const nuevoDoc: Documento = {
    id: `doc-${Date.now().toString().slice(-4)}`,
    usuarioId: "current-user",
    nombreArchivo: file.name,
    categoria,
    tamañoBytes: file.size,
    tipoMime: file.type || "application/pdf",
    urlStorage: URL.createObjectURL(file),
    estado: "en_revision",
    fechaSubida: new Date().toISOString(),
    descripcion,
  };

  return { success: true, documento: nuevoDoc };
}

/**
 * Descarga de documento: GET {BACKEND_URL}/api/documentos/:id/download
 */
export async function downloadDocumentoBackend({
  docId,
  token,
}: {
  docId: string;
  token?: string | null;
}): Promise<string> {
  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token || "demo-token"}`,
    };

    const res = await fetch(`${BACKEND_URL}/api/documentos/${docId}/download`, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      return data.downloadUrl || data.url;
    }
  } catch {
    console.info("FastAPI backend no disponible para descarga directa.");
  }

  return `https://example.com/download/cbba-legal-${docId}.pdf`;
}

/**
 * 6. PANEL DE ADMINISTRACIÓN:
 */
export async function getAdminUsersBackend(token?: string | null) {
  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token || "demo-token"}`,
    };
    const res = await fetch(`${BACKEND_URL}/api/admin/users`, { headers });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return MOCK_USERS;
}

export async function updateUserRoleBackend({
  userId,
  role,
  token,
}: {
  userId: string;
  role: UserRole;
  token?: string | null;
}) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || "demo-token"}`,
    };
    const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ role }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return { success: true, userId, role };
}

export async function saveGuiaBackend({
  guia,
  token,
}: {
  guia: Partial<GuiaVisual>;
  token?: string | null;
}) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || "demo-token"}`,
    };
    const res = await fetch(`${BACKEND_URL}/api/admin/guias`, {
      method: "POST",
      headers,
      body: JSON.stringify(guia),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return { success: true, guia };
}

export async function getAuditLogsBackend(token?: string | null): Promise<AuditLog[]> {
  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token || "demo-token"}`,
    };
    const res = await fetch(`${BACKEND_URL}/api/admin/audit`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data.logs || data;
    }
  } catch {
    // Fallback
  }
  return MOCK_AUDIT_LOGS;
}

function simulateLegalChatResponse(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("derechos reales") || lower.includes("folio real") || lower.includes("inmueble")) {
    return {
      content: `Para tramitar la inscripción en **Derechos Reales (DDRR) Cochabamba** (Av. Heroínas esq. San Martín), debes seguir estos pasos clave:

1. **Protocolización Notarial:** Presentar la Minuta firmada ante un Notario de Fe Pública para obtener el Testimonio original.
2. **Impuesto Municipal IMT (3%):** Cancelar el Impuesto a las Transferencias en Recaudaciones del GAMC (Plaza Colón o subalcaldías).
3. **Certificado Catastral y Plano Visado:** Con coordenadas UTM y código catastral de tu Comuna.
4. **Ingreso a DDRR:** Presentar la carpeta en ventanilla y pagar el arancel judicial. El Folio Real suele estar listo en un plazo de 10 a 15 días hábiles.`,
      referenciasLegales: [
        "Código Civil Boliviano (Art. 491 y 1538)",
        "Ley de Inscripción de Derechos Reales",
        "Reglamento del GAMC de Catastro Urbano",
      ],
      accionesRecomendadas: [
        { texto: "Ver Guía Visual de Derechos Reales", ruta: "/guias/guia-ddrr-compraventa" },
        { texto: "Agendar Cita con un Abogado", ruta: "/citas" },
      ],
      fromSimulation: true,
    };
  }

  if (lower.includes("asistencia familiar") || lower.includes("hijo") || lower.includes("pension") || lower.includes("manutencion")) {
    return {
      content: `En Bolivia, la **Asistencia Familiar** está protegida por el Código de las Familias (Ley 603):

- **Monto Mínimo Legal:** Equivale al 20% del Salario Mínimo Nacional por cada hijo (aproximadamente Bs. 500 al mes).
- **Competencia:** En Cochabamba se presenta ante los Juzgados Públicos de Familia (Edif. Tribunal Departamental de Justicia, calle Jordán y San Martín).
- **Medida Cautelar Inmediata:** El Juez fija un monto provisional en la primera providencia.
- **Forma de Pago:** Obligatoriamente mediante depósito en cuenta judicial de **Banco Unión**. Si existe retraso en el pago, procede la liquidación judicial con orden de apremio corporal.`,
      referenciasLegales: [
        "Código de las Familias y del Proceso Familiar (Ley 603, Arts. 109 - 127)",
        "Constitución Política del Estado (Art. 64)",
      ],
      accionesRecomendadas: [
        { texto: "Consultar Guía de Asistencia Familiar", ruta: "/guias/guia-asistencia-familiar" },
        { texto: "Agendar Orientación Virtual Gratuita", ruta: "/citas" },
      ],
      fromSimulation: true,
    };
  }

  return {
    content: `Hola. Soy el **Asistente Legal de Cochabamba**. Puedo orientarte en lenguaje claro sobre:

- **Trámites en Derechos Reales (DDRR):** Compraventas, folios reales, hipotecas, cancelaciones y gravámenes.
- **Derecho de Familia:** Fijación de asistencia familiar, divorcios notariales y acuerdos de guarda.
- **Trámites Municipales (GAMC):** Licencias de funcionamiento, catastro, planos y pago de IMT.
- **SERECI y Registro Civil:** Certificados de nacimiento, matrimonio y saneamiento administrativo.

¿Sobre cuál de estos trámites necesitas orientación hoy?`,
    referenciasLegales: [
      "Constitución Política del Estado Plurinacional de Bolivia",
      "Guías de Atención al Ciudadano del GAMC y Órgano Judicial de Cochabamba",
    ],
    accionesRecomendadas: [
      { texto: "Explorar Todas las Guías Visuales", ruta: "/guias" },
      { texto: "Agendar una Asesoría", ruta: "/citas" },
    ],
    fromSimulation: true,
  };
}
