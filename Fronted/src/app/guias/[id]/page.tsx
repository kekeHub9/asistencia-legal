import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuiaById, getGuiasVisuales } from "@/lib/supabase/client";
import { FlowchartViewer } from "@/components/guias/FlowchartViewer";
import {
  ArrowLeft,
  Clock,
  Coins,
  Building,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  CalendarCheck2,
  MessageSquareText,
  HelpCircle,
  Share2,
  Printer,
  ChevronRight,
} from "lucide-react";

interface GuiaPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const guias = await getGuiasVisuales();
  return guias.map((g) => ({ id: g.id }));
}

export default async function GuiaDetailPage({ params }: GuiaPageProps) {
  const { id } = await params;
  const guia = await getGuiaById(id);

  if (!guia) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Miga de Pan y Botón Volver */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/guias"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo de Guías</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold border border-blue-200 transition-colors"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Consultar sobre este trámite</span>
          </Link>
          <Link
            href="/citas"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </Link>
        </div>
      </div>

      {/* 2. Cabecera Principal de la Guía */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {guia.categoria}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Dificultad: {guia.dificultad}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {guia.titulo}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            {guia.descripcionLarga || guia.descripcionCorta}
          </p>
        </div>

        {/* Ficha Rápida: Ubicación, Duración, Costo, Entidad */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Entidad Competente
            </span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{guia.entidadResponsable}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Sede en Cochabamba
            </span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{guia.ubicacionSede}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Tiempo Promedio
            </span>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{guia.duracionEstimada}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Costo Aproximado
            </span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>~Bs. {guia.costoTotalAproximadoBs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DIAGRAMA INTERACTIVO REACT FLOW */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Ruta Procesal Interactiva</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-md">
              React Flow
            </span>
          </h2>
        </div>

        <FlowchartViewer
         nodes={guia.flujoDiagrama?.nodes || []}
         edges={guia.flujoDiagrama?.edges || []}
          title={guia.titulo}
          />
      </section>

      {/* 4. PASO A PASO CON LENGUAJE CLARO Y REQUISITOS ("+2 MÁS") */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Procedimiento Detallado Paso a Paso
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicación traducida a lenguaje claro con bases jurídicas y alertas preventivas
          </p>
        </div>

        <div className="space-y-6">
          {guia.pasos.map((paso, index) => (
          <div
              key={index} // Usamos el index del map, o si tienes un ID único, usa paso.id
               className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-blue-200 transition-all"
            >
              {/* Encabezado del Paso */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    {paso.numero}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {paso.titulo}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paso.entidad}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {paso.duracionEstimada}
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    Bs. {paso.costoBs}
                  </span>
                </div>
              </div>

              {/* Explicación en Lenguaje Claro vs Detalle Legal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    ¿Qué significa para ti? (Lenguaje Claro)
                  </span>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                    {paso.resumenSimple}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Fundamento Jurídico / Base Legal
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                    {paso.detalleLegal}
                  </p>
                </div>
              </div>

              {/* Requisitos del Paso con "+2 más" */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documentos y Requisitos para este paso:</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {paso.requisitosClave?.map((req, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{req}</span>
                    </span>
                  ))}

                  {paso.requisitosAdicionales &&
                    paso.requisitosAdicionales.map((req, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-medium"
                      >
                        <span className="text-[10px] font-bold bg-blue-200 text-blue-800 px-1 rounded">
                          +{i + 1} más
                        </span>
                        <span>{req}</span>
                      </span>
                    ))}
                </div>
              </div>

              {/* Consejo Práctico del Abogado */}
              {paso.consejoPractico && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Consejo del profesional:</strong> {paso.consejoPractico}
                  </div>
                </div>
              )}

              {/* Alerta Importante */}
              {paso.alertaImportante && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Atención:</strong> {paso.alertaImportante}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES (FAQ) */}
      {guia.faq && guia.faq.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Preguntas Frecuentes sobre este Trámite
            </h2>
          </div>

          <div className="space-y-3">
            {guia.faq.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {item.pregunta}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.respuesta}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. BANNER DE CIERRE CON ACCIÓN */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-lg font-bold">¿Tienes dudas con este proceso?</h3>
          <p className="text-xs text-blue-200 mt-1">
            Consulta al Chatbot de Asistencia Legal o agenda una revisión presencial en Cochabamba.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/chat"
            className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Abrir Chatbot
          </Link>
          <Link
            href="/citas"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Agendar Asesoría
          </Link>
        </div>
      </div>
    </div>
  );
}
