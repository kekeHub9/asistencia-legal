import React from "react";
import Link from "next/link";
import { GuiaVisual } from "@/types";
import {
  Clock,
  Coins,
  Building2,
  ArrowRight,
  ListOrdered,
  FileCheck2,
  Sparkles,
} from "lucide-react";

interface GuiaCardProps {
  guia: GuiaVisual;
}

export function GuiaCard({ guia }: GuiaCardProps) {
  const categoryLabels: Record<string, { label: string; color: string }> = {
    inmuebles: { label: "Derecho Inmobiliario", color: "bg-amber-100 text-amber-800 border-amber-200" },
    familia: { label: "Derecho de Familia", color: "bg-rose-100 text-rose-800 border-rose-200" },
    municipal: { label: "Trámites GAMC", color: "bg-blue-100 text-blue-800 border-blue-200" },
    identidad: { label: "SERECI / Identidad", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    comercial: { label: "Comercial / Empresa", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    penal: { label: "Penal / Garantías", color: "bg-purple-100 text-purple-800 border-purple-200" },
  };

  const cat = categoryLabels[guia.categoria] || {
    label: guia.categoria,
    color: "bg-slate-100 text-slate-800 border-slate-200",
  };

  // Requisitos destacados y badge "+X más"
 // const visibleRequirements = guia.requisitosGenerales.slice(0, 2);
 // const remainingCount = Math.max(0, guia.requisitosGenerales.length - 2);
// Aseguramos que siempre haya un arreglo, incluso si viene vacío de la BD
const requisitos = guia.requisitosGenerales || [];
const visibleRequirements = requisitos.slice(0, 2);
const remainingCount = Math.max(0, requisitos.length - 2);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Encabezado de la tarjeta con etiquetas visuales */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}
          >
            {cat.label}
          </span>
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
            <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
            {guia.pasos.length} pasos
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
          {guia.titulo}
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {guia.descripcionCorta}
        </p>
      </div>

      {/* Métricas clave en lenguaje claro (Duración, Costo, Entidad) */}
      <div className="px-5 py-3 bg-slate-50/70 border-y border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{guia.duracionEstimada}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-emerald-700">
          <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">~Bs. {guia.costoTotalAproximadoBs}</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{guia.entidadResponsable}</span>
        </div>
      </div>

      {/* Vista previa de requisitos con "+2 más" */}
      <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Requisitos principales:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visibleRequirements.map((req, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 line-clamp-1 max-w-[200px]"
                title={req}
              >
                {req}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                +{remainingCount} más
              </span>
            )}
          </div>
        </div>

        {/* Botón de acción */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            href={`/guias/${guia.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs group-hover:shadow-md"
          >
            <span>Ver Flujo y Pasos Detallados</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
