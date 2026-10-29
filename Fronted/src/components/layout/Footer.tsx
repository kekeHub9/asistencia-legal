import React from "react";
import Link from "next/link";
import { Scale, ShieldAlert, ExternalLink, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Advertencia Legal AI Obligatoria */}
        <div className="mb-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300">
              Aviso Legal Importante:
            </span>{" "}
            Asistencia Legal es una plataforma de apoyo y orientación ciudadana con inteligencia artificial.{" "}
            <strong>Siempre verifica trámites críticos con un profesional del derecho</strong> o directamente ante las oficinas del Órgano Judicial de Cochabamba, GAMC o Derechos Reales.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Presentación Legal Design */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-bold text-white text-base">
                Asistencia Legal Cbba
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Iniciativa de <em>Legal Design</em> enfocada en derribar barreras burocráticas y jerga legal para los ciudadanos del departamento de Cochabamba, Bolivia.
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Cochabamba, Bolivia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Línea de Orientación Ciudadana</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Módulos del Sistema */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Módulos del Sistema
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/guias" className="hover:text-white transition-colors">
                  Guías Visuales Paso a Paso
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  Chatbot Legal con IA
                </Link>
              </li>
              <li>
                <Link href="/citas" className="hover:text-white transition-colors">
                  Agenda de Citas Jurídicas
                </Link>
              </li>
              <li>
                <Link href="/documentos" className="hover:text-white transition-colors">
                  Repositorio Documental RLS
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Acceso con Google OAuth 2.0
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Entidades Públicas de Cochabamba */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Entidades en Cochabamba
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://tdj-cochabamba.organojudicial.gob.bo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Tribunal Dptal. de Justicia</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://derechosreales.gob.bo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Derechos Reales (DDRR)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cochabamba.bo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Alcaldía GAMC (Plaza Colón)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://oep.org.bo/sereci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>SERECI Registro Cívico</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Arquitectura del Proyecto */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Stack Tecnológico
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>
                <strong className="text-slate-300">Frontend:</strong> Next.js 16 + React 19 + TypeScript
              </p>
              <p>
                <strong className="text-slate-300">Diagramas:</strong> React Flow (@xyflow/react)
              </p>
              <p>
                <strong className="text-slate-300">Auth & Lecturas:</strong> Supabase (RLS con Anon Key)
              </p>
              <p>
                <strong className="text-slate-300">Backend Sensible:</strong> FastAPI (Python)
              </p>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[11px] border border-blue-700/50">
                  Taller de Programación 4 &bull; UCB Cbba
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Asistencia Legal Cochabamba. Todos los derechos reservados.</p>
          <p className="text-[11px]">Diseñado con principios de accesibilidad y bajo consumo de datos.</p>
        </div>
      </div>
    </footer>
  );
}
