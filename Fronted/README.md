# Asistencia Legal Cochabamba &bull; Frontend Web

Sistema web con asistencia legal visual y gestión automatizada para mejorar la comprensión de procesos legales de los ciudadanos del departamento de Cochabamba (Bolivia).

Desarrollado con principios de **Legal Design** (jerarquía visual clara, reducción de jerga técnica, visualización paso a paso y alta accesibilidad con bajo consumo de datos).

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Frontend** | **Next.js 16 (App Router)** | Renderizado híbrido (SSR/SSG), Server Components y rutas dinámicas |
| **Lenguaje** | **TypeScript** | Tipado estricto de entidades legales, roles y contratos de API |
| **Estilos & Diseño** | **TailwindCSS v4** | Sistema de diseño responsivo y accesible |
| **Diagramas de Flujo** | **React Flow (`@xyflow/react`)** | Diagramas interactivos con nodos procesales, bifurcaciones y zoom |
| **Base de Datos & Auth** | **Supabase (`@supabase/supabase-js`)** | Google OAuth 2.0 y lecturas seguras protegidas por **Row Level Security (RLS)** |
| **Backend de Operaciones** | **FastAPI (Python)** | Chatbot conversacional con IA, carga de documentos multipart y gestión de citas |

---

## 📁 Estructura del Proyecto

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout con Navbar y Footer
│   │   ├── page.tsx                  # Landing page de Legal Design
│   │   ├── login/page.tsx            # Login Google OAuth y conmutador de roles demo
│   │   ├── auth/callback/route.ts    # Callback de intercambio OAuth Supabase
│   │   ├── guias/
│   │   │   ├── page.tsx              # Galería y búsqueda de guías
│   │   │   └── [id]/page.tsx         # Paso a paso + diagrama interactivo React Flow
│   │   ├── chat/page.tsx             # Chatbot Legal conectado a FastAPI
│   │   ├── citas/page.tsx            # Calendario mensual y reserva de citas
│   │   ├── documentos/page.tsx       # Repositorio documental del ciudadano
│   │   └── admin/page.tsx            # Panel de control (usuarios, guías y auditoría)
│   ├── components/
│   │   ├── layout/                   # Navbar (con selector de roles) y Footer
│   │   ├── guias/                    # GuiaCard y FlowchartViewer (React Flow)
│   │   ├── chat/                     # LegalChat con advertencias AI y referencias
│   │   ├── citas/                    # CalendarView con modal interactivo
│   │   ├── documentos/               # DocumentRepo (subida multipart y descarga)
│   │   ├── admin/                    # AdminDashboard (roles, CRUD y auditoría)
│   │   └── providers/                # AppProviders (AuthProvider wrapper)
│   ├── lib/
│   │   ├── supabase/client.ts        # Cliente Supabase seguro con RLS
│   │   ├── api/backend-client.ts     # Cliente HTTP hacia FastAPI con Bearer JWT
│   │   ├── auth-context.tsx          # Contexto React de autenticación y roles
│   │   └── mock-data.ts              # Procedimientos reales de Cochabamba (DDRR, GAMC, SERECI)
│   └── types/index.ts                # Interfaces TypeScript del dominio legal
├── fastapi-backend-sample/           # Servidor backend complementario en FastAPI
│   ├── main.py                       # Endpoints /api/chat, /api/citas, /api/documentos, etc.
│   └── requirements.txt
├── supabase-schema.sql               # Script PostgreSQL con tablas, triggers y políticas RLS
├── .env.example                      # Plantilla de variables de entorno
└── .env.local                        # Variables de entorno locales
```

---

## ⚙️ Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration (Auth y lecturas con RLS)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase

# Backend FastAPI Configuration (Chatbot, Citas, Subida de documentos)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

> **Nota de Resiliencia:** Si aún no has conectado un proyecto real de Supabase o tu backend de FastAPI está apagado, la aplicación activa automáticamente el **Modo Demostración / Simulación Local**, permitiendo navegar, interactuar con el chatbot, probar el calendario de citas y ver los diagramas de React Flow de inmediato.

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Iniciar el Frontend (Next.js 16)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo (puerto 3000)
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### 2. Iniciar el Backend Complementario (FastAPI)

En una terminal separada:

```bash
cd fastapi-backend-sample
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

El backend quedará activo en [http://localhost:8000](http://localhost:8000) y su documentación interactiva Swagger en [http://localhost:8000/docs](http://localhost:8000/docs). El frontend detectará automáticamente la conexión activa (indicador verde `FastAPI: Conectado (8000)` en el navbar).

---

## 🔐 Configuración de Supabase y Google OAuth

### 1. Ejecutar el Script SQL
1. Ingresa a tu panel en [Supabase](https://supabase.com/).
2. Dirígete a **SQL Editor**.
3. Copia y pega el contenido del archivo [`supabase-schema.sql`](./supabase-schema.sql) y pulsa **Run**.
4. Este script crea:
   - Tabla `profiles` vinculada a `auth.users` mediante un trigger automático.
   - Tabla `guias_visuales` con soporte JSONB para los diagramas de React Flow.
   - Tabla `citas` con políticas RLS (cada ciudadano solo puede consultar sus citas).
   - Tabla `documentos` con políticas RLS de privacidad.
   - Tabla `auditoria`.

### 2. Activar Google OAuth en Supabase
1. En Supabase, ve a **Authentication** &rarr; **Providers** &rarr; **Google**.
2. Activa el proveedor e introduce tu **Client ID** y **Client Secret** generados en Google Cloud Console.
3. En Google Cloud Console, añade la URL de redirección autorizada:
   `https://<TU-PROJECT-ID>.supabase.co/auth/v1/callback`
4. En Supabase, añade a **URL Configuration** la redirección del sitio local:
   `http://localhost:3000/auth/callback`

### 3. Delegación de Token al Backend FastAPI
Al iniciar sesión con Google mediante Supabase Auth:
1. El frontend obtiene el `access_token` de la sesión.
2. Cada petición al backend FastAPI inyecta la cabecera:
   ```http
   Authorization: Bearer <access_token>
   ```
3. FastAPI valida el token y autoriza la ejecución del chatbot, la reserva de citas y la subida de documentos a Supabase Storage.

---

## 🎭 Conmutador de Roles para Pruebas Rápidas

Para facilitar la evaluación de todas las perspectivas del sistema sin requerir configuración previa de Google Cloud:
- Puedes cambiar de rol en cualquier momento desde el selector en la esquina superior derecha del **Navbar** o en la pantalla de **[/login](http://localhost:3000/login)**:
  - **Ciudadano (Carlos Mamani):** Consulta de guías, agenda citas y visualiza sus propios documentos.
  - **Abogado (Dra. Valeria Soliz):** Consulta las citas programadas y orienta casos.
  - **Administrador (Lic. Fernando Rocha):** Acceso al **[/admin](http://localhost:3000/admin)** para gestionar roles de usuarios, publicar nuevas guías y auditar logs del sistema.

---

## 🏛️ Módulos Implementados

### 1. Guías Visuales con React Flow
- Galería de trámites destacados de Cochabamba:
  - **Derechos Reales (DDRR):** Inscripción de inmueble y obtención de Folio Real.
  - **Tribunal Departamental de Justicia:** Fijación y cobro de Asistencia Familiar (Ley 603).
  - **Alcaldía GAMC (Plaza Colón):** Licencia de Funcionamiento de actividades económicas.
  - **SERECI:** Saneamiento y corrección de certificados de nacimiento.
- Vista paso a paso en lenguaje claro con costos oficiales en Bolivianos (Bs.), tiempos de trámite, consejos del abogado y requisitos con badge **&ldquo;+2 más&rdquo;**.
- **Diagrama de flujo interactivo con React Flow** con nodos de inicio, trámites institucionales, puertas de decisión y zoom/pan.

### 2. Chatbot Legal con IA (FastAPI)
- Pantalla conversacional en **[/chat](http://localhost:3000/chat)**.
- Envía peticiones POST a `{BACKEND_URL}/api/chat` con el JWT del usuario.
- Muestra sugerencias de preguntas rápidas, referencias legales (Código Civil, Ley 603) y enlaces a trámites.
- **Advertencia legal visible obligatoria:**
  > *"Asistencia Legal es un asistente AI. Siempre verifica trámites críticos con un profesional."*

### 3. Gestión de Citas
- Calendario interactivo mensual en **[/citas](http://localhost:3000/citas)**.
- Agendar cita: Envía POST a `{BACKEND_URL}/api/citas` con modalidad presencial (Av. Heroínas, Cochabamba) o virtual (Google Meet).
- Listar citas: Lectura directa desde Supabase protegida por RLS.

### 4. Repositorio Documental
- Módulo en **[/documentos](http://localhost:3000/documentos)**.
- Subida de archivos: Formulario multipart POST a `{BACKEND_URL}/api/documentos/upload` con token JWT.
- Listar documentos propios con Supabase RLS.
- Descarga segura vía endpoint `{BACKEND_URL}/api/documentos/:id/download`.

### 5. Panel de Administración
- Módulo protegido en **[/admin](http://localhost:3000/admin)** (requiere rol `administrador`).
- **Gestión de Usuarios y Roles:** Modificación dinámica de roles entre Ciudadano, Abogado y Administrador.
- **CRUD de Guías Visuales:** Creación y publicación de nuevas guías con cálculo de costos y requisitos.
- **Vista de Auditoría:** Trazabilidad de accesos, consultas del chatbot y operaciones.

---

## 🧪 Verificación y Construcción

Para compilar y verificar que la aplicación no tiene errores de TypeScript o empaquetado:

```bash
npm run build
```

Generará el build estático y dinámico con todas las páginas optimizadas.
