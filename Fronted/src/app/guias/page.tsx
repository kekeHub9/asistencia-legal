"use client";

import React, { useState, useEffect } from "react";
import { getGuiasVisuales } from "@/lib/supabase/client";
import { GuiaVisual, ProcedimientoCategoria } from "@/types";
import { GuiaCard } from "@/components/guias/GuiaCard";
import {
  Compass,
  Search,
  Filter,
  Building,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function GuiasPage() {
  const [guias, setGuias] = useState<GuiaVisual[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGuiasVisuales().then((data) => {
      setGuias(data);
      setIsLoading(false);
    });
  }, []);

  const categories = [
    { id: "todas", label: "Todas las Guías" },
    { id: "inmuebles", label: "Derechos Reales" },
    { id: "familia", label: "Asistencia Familiar" },
    { id: "municipal", label: "Alcaldía GAMC" },
    { id: "identidad", label: "SERECI / Partidas" },
  ];

  const filteredGuias = guias.filter((guia) => {
    const matchesSearch =
      guia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.descripcionCorta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.entidadResponsable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "todas" || guia.categoria === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera de Sección */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <Compass className="w-4 h-4" />
          <span>Módulo de Guías Visuales &bull; Supabase RLS</span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Guías de Trámites Paso a Paso
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Explora las rutas jurídicas más frecuentes en el departamento de Cochabamba. Cada guía incluye diagramas interactivos, costos oficiales en Bolivianos (Bs.), requisitos y consejos prácticos.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Barra de Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por trámite (ej: Folio Real, GAMC, Asistencia)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Chips de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-semibold transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Guías Visuales */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Cargando catálogo de trámites desde Supabase...
        </div>
      ) : filteredGuias.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">
            No se encontraron guías para &ldquo;{searchTerm}&rdquo;
          </h3>
          <p className="text-xs text-slate-500">
            Intenta con otro término de búsqueda o selecciona otra categoría.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("todas");
            }}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuias.map((guia) => (
            <GuiaCard key={guia.id} guia={guia} />
          ))}
        </div>
      )}
    </div>
  );
}
