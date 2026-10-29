import React from "react";
import Link from "next/link";
import { getGuiasVisuales } from "@/lib/supabase/client";
import { GuiaCard } from "@/components/guias/GuiaCard";
import {
  Compass,
  MessageSquareText,
  CalendarDays,
  FolderLock,
  Scale,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Building,
  HelpCircle,
  Network,
  Lock,
} from "lucide-react";

export default async function HomePage() {
  const guias = await getGuiasVisuales();
  const featuredGuias = guias.filter((g) => g.destacado);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION CON ENFOQUE LEGAL DESIGN */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Patrón de fondo geométrico */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Legal Design para Ciudadanos de Cochabamba &bull; Bolivia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Comprende tus trámites legales{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
              de forma visual y sencilla
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Eliminamos la jerga burocrática y los tecnicismos oscuros. Aprende cómo realizar tus trámites en{" "}
            <strong className="text-white">Derechos Reales</strong>, la{" "}
            <strong className="text-white">Alcaldía GAMC</strong> y el{" "}
            <strong className="text-white">SERECI</strong> con flujos interactivos, chatbot legal con IA y gestión automatizada.
          </p>

          {/* Botones de Acción Primarios */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/guias"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Ver Guías y Diagramas</span>
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-750 text-white text-sm font-semibold rounded-xl border border-slate-700 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4 text-amber-300" />
              <span>Consultar al Asistente AI</span>
            </Link>
          </div>

          {/* Estadísticas de Impacto Ciudadano */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-amber-300">4 Entidades</div>
              <div className="text-slate-400 mt-0.5">DDRR, GAMC, SERECI y TDJ</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-emerald-300">100% Visual</div>
              <div className="text-slate-400 mt-0.5">Flujos y Diagramas React Flow</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-blue-300">Supabase RLS</div>
              <div className="text-slate-400 mt-0.5">Lectura y Auth Segura</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-purple-300">FastAPI</div>
              <div className="text-slate-400 mt-0.5">Chatbot, Citas y Archivos</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PILARES DE LEGAL DESIGN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            ¿Cómo transformamos la burocracia legal?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Principios de diseño legal aplicados a la realidad procesal de Cochabamba
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Lenguaje Claro Ciudadano
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traducimos términos como <em>&ldquo;protocolización de minuta&rdquo;</em> o <em>&ldquo;asiento registral subinscripción A&rdquo;</em> a explicaciones paso a paso que cualquier vecino puede entender y seguir sin perderse.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Diagramas de Flujo Interactivos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada procedimiento legal cuenta con un mapa interactivo con React Flow: visualiza los caminos alternativos, puntos de decisión y ventanillas institucionales antes de salir de casa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Seguridad y Control RLS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tus documentos y citas están protegidos con Row Level Security en Supabase. Las operaciones sensibles se autentican mediante JWT delegados a un backend de alto rendimiento en FastAPI.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GUÍAS VISUALES DESTACADAS DE COCHABAMBA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Trámites Frecuentes en Cochabamba
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Guías paso a paso con requisitos, costos oficiales y tiempos estimados
            </p>
          </div>

          <Link
            href="/guias"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGuias.map((guia) => (
            <GuiaCard key={guia.id} guia={guia} />
          ))}
        </div>
      </section>

      {/* 4. BANNER DE CHATBOT CON ADVERTENCIA VISIBLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <MessageSquareText className="w-3.5 h-3.5 text-amber-300" />
              <span>Asistente Jurídico Conversacional</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              ¿Tienes dudas sobre un trámite específico en Cochabamba?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pregunta directamente a nuestro chatbot legal impulsado por FastAPI. Responderá tus dudas con referencias a la normativa boliviana (Código Civil, Ley 603, decretos del GAMC) en lenguaje sencillo.
            </p>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <strong>Recordatorio:</strong> Asistencia Legal es un asistente AI. Siempre verifica trámites críticos con un profesional del derecho colegiado.
            </div>

            <div className="pt-2">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md"
              >
                <span>Iniciar Consulta en el Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GESTIÓN DE CITAS Y REPOSITORIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Citas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Agenda de Asesoría Legal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Programa citas presenciales en nuestras oficinas centrales de Cochabamba (Av. Heroínas) o consultas virtuales por Google Meet. Listado sincronizado con Supabase RLS.
              </p>
            </div>
            <Link
              href="/citas"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Abrir Calendario de Citas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tarjeta de Documentos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Repositorio Documental Ciudadano
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sube tu cédula, testimonios, folios reales o proformas de catastro. Los archivos se suben a Supabase Storage con validación multipart vía FastAPI.
              </p>
            </div>
            <Link
              href="/documentos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              <span>Gestionar Mis Documentos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
