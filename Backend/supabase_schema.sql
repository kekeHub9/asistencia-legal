-- =============================================================================
-- SQL COMPLEMENTARIO PARA SUPABASE
-- Solo ejecuta esto si ya tenías tu base de datos previa instalada.
-- Agrega las tablas faltantes requeridas por el Backend.
-- =============================================================================

-- 1. Tabla FAQ Legal (para la búsqueda legal sin IA)
CREATE TABLE IF NOT EXISTS public.faq_legal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    respuesta TEXT NOT NULL,
    palabras_clave TEXT,
    categoria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faq_legal ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Autenticados leen FAQ"
        ON public.faq_legal FOR SELECT
        USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Tabla Conversaciones (para registrar las consultas de chat)
CREATE TABLE IF NOT EXISTS public.conversaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mensaje_usuario TEXT NOT NULL,
    respuesta_bot TEXT NOT NULL,
    resultados_encontrados INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversaciones ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Usuarios ven sus conversaciones"
        ON public.conversaciones FOR SELECT
        USING (auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Usuarios insertan conversaciones"
        ON public.conversaciones FOR INSERT
        WITH CHECK (auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. Política de actualización para Citas (permite reprogramar/cancelar)
DO $$ BEGIN
    CREATE POLICY "Partes actualizan la cita"
        ON public.citas FOR UPDATE
        USING (auth.uid() = usuario_id OR auth.uid() = abogado_id OR public.is_admin());
EXCEPTION WHEN duplicate_object THEN null;
END $$;
