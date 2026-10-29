export type UserRole = "ciudadano" | "abogado" | "administrador";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  ci?: string; // Cédula de Identidad (Bolivia)
  department?: string; // Cochabamba
  createdAt?: string;
}

export type ProcedimientoCategoria =
  | "inmuebles"
  | "familia"
  | "municipal"
  | "identidad"
  | "comercial"
  | "penal";

export interface PasoGuia {
  numero: number;
  titulo: string;
  resumenSimple: string; // Lenguaje claro ciudadano
  detalleLegal: string; // Explicación técnica jurídica
  entidad: string; // Ej: Derechos Reales Cochabamba
  duracionEstimada: string;
  costoBs: number;
  requisitosClave: string[]; // Primeros requisitos visibles
  requisitosAdicionales?: string[]; // "+2 más" en diseño visual
  consejoPractico?: string;
  alertaImportante?: string;
}

export interface FlujoNodeData {
  label: string;
  description?: string;
  tipo: "inicio" | "paso" | "decision" | "documento" | "fin";
  entidad?: string;
  duracion?: string;
  costo?: string;
  [key: string]: unknown;
}

export interface FlujoNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: FlujoNodeData;
}

export interface FlujoEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, unknown>;
}

export interface GuiaVisual {
  id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  categoria: ProcedimientoCategoria;
  entidadResponsable: string; // Ej: Derechos Reales Cochabamba
  ubicacionSede: string; // Ej: Av. Heroínas y San Martín, Cochabamba
  duracionEstimada: string;
  costoTotalAproximadoBs: number;
  dificultad: "Baja" | "Media" | "Alta";
  destacado: boolean;
  publicado: boolean;
  pasos: PasoGuia[];
  flujoDiagrama: {
    nodes: FlujoNode[];
    edges: FlujoEdge[];
  };
  requisitosGenerales: string[];
  documentosDescargables?: {
    nombre: string;
    url: string;
    tipo: string;
  }[];
  faq: {
    pregunta: string;
    respuesta: string;
  }[];
}

export type ModalidadCita = "presencial" | "virtual";
export type EstadoCita = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface Cita {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  abogadoId?: string;
  nombreAbogado?: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  modalidad: ModalidadCita;
  lugar: string; // Dirección física en Cochabamba o Link Google Meet
  materia: string;
  motivo: string;
  estado: EstadoCita;
  notas?: string;
  creadoEn: string;
}

export interface Documento {
  id: string;
  usuarioId: string;
  nombreArchivo: string;
  categoria: string;
  tamañoBytes: number;
  tipoMime: string;
  urlStorage: string;
  estado: "verificado" | "en_revision" | "observado";
  fechaSubida: string;
  descripcion?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  referenciasLegales?: string[];
  accionesRecomendadas?: {
    texto: string;
    ruta?: string;
  }[];
}

export interface AuditLog {
  id: string;
  usuario: string;
  email: string;
  rol: UserRole;
  accion: string;
  modulo: string;
  detalles: string;
  ip: string;
  fecha: string;
}
