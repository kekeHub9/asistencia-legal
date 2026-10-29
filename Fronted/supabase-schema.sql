-- ==============================================================================
-- SISTEMA DE ASISTENCIA LEGAL VISUAL - COCHABAMBA (BOLIVIA)
-- Esquema de Base de Datos PostgreSQL para Supabase con RLS (Row Level Security)
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tipo Enum para Roles de Usuario
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ciudadano', 'abogado', 'administrador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla de Perfiles (Extensión de auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'ciudadano'::user_role NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    ci TEXT, -- Cédula de Identidad de Bolivia (Ej: 6548912 Cbba.)
    department TEXT DEFAULT 'Cochabamba',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para sincronizar nuevos usuarios de Supabase Auth (Google OAuth) a profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'ciudadano'::user_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Tabla de Guías Visuales de Trámites
CREATE TABLE IF NOT EXISTS public.guias_visuales (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    descripcion_corta TEXT NOT NULL,
    descripcion_larga TEXT,
    categoria TEXT NOT NULL,
    entidad_responsable TEXT NOT NULL,
    ubicacion_sede TEXT NOT NULL,
    duracion_estimada TEXT NOT NULL,
    costo_total_aproximado_bs NUMERIC(10,2) DEFAULT 0 NOT NULL,
    dificultad TEXT DEFAULT 'Media',
    destacado BOOLEAN DEFAULT false,
    publicado BOOLEAN DEFAULT true,
    requisitos_generales JSONB DEFAULT '[]'::jsonb,
    pasos JSONB DEFAULT '[]'::jsonb NOT NULL,
    flujo_diagrama JSONB DEFAULT '{"nodes": [], "edges": []}'::jsonb NOT NULL,
    faq JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Citas Jurídicas
CREATE TABLE IF NOT EXISTS public.citas (
    id TEXT PRIMARY KEY DEFAULT ('cita-' || substr(md5(random()::text), 1, 8)),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_usuario TEXT NOT NULL,
    abogado_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre_abogado TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    modalidad TEXT DEFAULT 'presencial' CHECK (modalidad IN ('presencial', 'virtual')),
    lugar TEXT NOT NULL,
    materia TEXT NOT NULL,
    motivo TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Documentos Ciudadanos
CREATE TABLE IF NOT EXISTS public.documentos (
    id TEXT PRIMARY KEY DEFAULT ('doc-' || substr(md5(random()::text), 1, 8)),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nombre_archivo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    tipo_mime TEXT NOT NULL,
    url_storage TEXT NOT NULL,
    estado TEXT DEFAULT 'en_revision' CHECK (estado IN ('verificado', 'en_revision', 'observado')),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Auditoría
CREATE TABLE IF NOT EXISTS public.auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    usuario_nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    rol user_role NOT NULL,
    accion TEXT NOT NULL,
    modulo TEXT NOT NULL,
    detalles TEXT,
    ip_origen TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guias_visuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

-- Regla helper para saber si el usuario actual es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: PROFILES
CREATE POLICY "Usuarios pueden ver su propio perfil o perfiles públicos"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS: GUÍAS VISUALES (Lectura pública directa desde Supabase con Anon Key)
CREATE POLICY "Cualquier persona puede leer guías visuales publicadas"
    ON public.guias_visuales FOR SELECT
    USING (publicado = true OR public.is_admin());

CREATE POLICY "Solo administradores pueden crear o modificar guías"
    ON public.guias_visuales FOR ALL
    USING (public.is_admin());

-- RLS: CITAS (El ciudadano solo lee sus propias citas)
CREATE POLICY "Ciudadanos leen sus propias citas"
    ON public.citas FOR SELECT
    USING (auth.uid() = usuario_id OR auth.uid() = abogado_id OR public.is_admin());

CREATE POLICY "Ciudadanos pueden agendar citas"
    ON public.citas FOR INSERT
    WITH CHECK (auth.uid() = usuario_id OR public.is_admin());

-- RLS: DOCUMENTOS (El ciudadano solo lee sus propios documentos)
CREATE POLICY "Ciudadanos ven exclusivamente sus documentos"
    ON public.documentos FOR SELECT
    USING (auth.uid() = usuario_id OR public.is_admin());

CREATE POLICY "Ciudadanos pueden subir sus propios documentos"
    ON public.documentos FOR INSERT
    WITH CHECK (auth.uid() = usuario_id OR public.is_admin());

-- RLS: AUDITORÍA (Solo administradores)
CREATE POLICY "Solo administradores pueden ver registros de auditoría"
    ON public.auditoria FOR SELECT
    USING (public.is_admin());
