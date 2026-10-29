import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { GuiaVisual, Cita, Documento } from "@/types";
import { MOCK_GUIAS, MOCK_CITAS, MOCK_DOCUMENTOS } from "@/lib/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes("sample-cochabamba-legal") ||
    supabaseUrl.includes("xyzcompany") ||
    supabaseAnonKey.includes("sample-anon-key-placeholder")
  ) {
    return false;
  }
  return true;
};

// Singleton Supabase browser client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const validUrl =
      supabaseUrl && supabaseUrl.startsWith("http")
        ? supabaseUrl
        : "https://placeholder-cochabamba-legal.supabase.co";
    const validKey = supabaseAnonKey || "placeholder-anon-key";

    supabaseInstance = createClient(validUrl, validKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

/**
 * Mapper para transformar filas de Supabase (snake_case) al modelo TypeScript Cita
 */
export function mapDbCitaToCita(row: any): Cita {
  return {
    id: String(row.id),
    usuarioId: row.usuario_id || row.usuarioId || "",
    nombreUsuario: row.nombre_usuario || row.nombreUsuario || "Carlos Mamani Torrico",
    abogadoId: row.abogado_id || row.abogadoId || "",
    nombreAbogado: row.nombre_abogado || row.nombreAbogado || "Dra. Valeria Soliz Guzmán",
    fecha: row.fecha,
    hora: row.hora ? String(row.hora).slice(0, 5) : "10:00",
    modalidad: (row.modalidad as "presencial" | "virtual") || "presencial",
    lugar: row.lugar || "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Cochabamba)",
    materia: row.materia || "General",
    motivo: row.motivo || "",
    estado: (row.estado as "pendiente" | "confirmada" | "completada" | "cancelada") || "pendiente",
    notas: row.notas || "",
    creadoEn: row.created_at || row.creadoEn || new Date().toISOString(),
  };
}

/**
 * Lectura de Guías Visuales con Supabase RLS.
 */
export async function getGuiasVisuales(): Promise<GuiaVisual[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_GUIAS;
  }

  try {
    const { data, error } = await supabase
      .from("guias_visuales")
      .select("*")
      .eq("publicado", true);

    if (error || !data || data.length === 0) {
      return MOCK_GUIAS;
    }

    return data as GuiaVisual[];
  } catch (err) {
    return MOCK_GUIAS;
  }
}

/**
 * Obtener una Guía Visual por ID o Slug
 */
export async function getGuiaById(idOrSlug: string): Promise<GuiaVisual | null> {
  if (!isSupabaseConfigured()) {
    const found = MOCK_GUIAS.find(
      (g) => g.id === idOrSlug || g.slug === idOrSlug
    );
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from("guias_visuales")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (error || !data) {
      const found = MOCK_GUIAS.find(
        (g) => g.id === idOrSlug || g.slug === idOrSlug
      );
      return found || null;
    }

    return data as GuiaVisual;
  } catch {
    const found = MOCK_GUIAS.find(
      (g) => g.id === idOrSlug || g.slug === idOrSlug
    );
    return found || null;
  }
}

/**
 * Lectura de Citas con prioridad en Backend FastAPI y Supabase.
 * Devuelve la lista persistente de la base de datos real.
 */
export async function getUserCitas(userId?: string): Promise<Cita[]> {
  // 1. Intentar obtener citas a través del Backend FastAPI
  try {
    const res = await fetch(`${backendUrl}/api/citas`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer demo-token-client",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const rows = data.citas || (Array.isArray(data) ? data : []);
      if (Array.isArray(rows)) {
        return rows.map(mapDbCitaToCita);
      }
    }
  } catch (e) {
    // Backend offline, continuar con Supabase directo
  }

  // 2. Si FastAPI está offline o no responde, consultar Supabase directamente
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .order("fecha", { ascending: true });

      if (!error && data) {
        return data.map(mapDbCitaToCita);
      }
    } catch (e) {
      // Error consultando Supabase directo
    }
  }

  // 3. Fallback solo si no hay conexión a Supabase ni a FastAPI
  return MOCK_CITAS;
}

/**
 * Lectura de Repositorio Documental con Supabase RLS.
 */
export async function getUserDocumentos(userId: string): Promise<Documento[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_DOCUMENTOS.filter(
      (d) => d.usuarioId === userId || userId.startsWith("usr-")
    );
  }

  try {
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_DOCUMENTOS;
    }

    return data as Documento[];
  } catch {
    return MOCK_DOCUMENTOS;
  }
}
