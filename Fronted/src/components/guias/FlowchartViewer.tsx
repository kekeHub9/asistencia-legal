"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import { FlujoNode, FlujoEdge, FlujoNodeData } from "@/types";
import {
  Clock,
  Coins,
  CheckCircle2,
  HelpCircle,
  FileText,
  Building,
} from "lucide-react";

// Componente de Nodo Personalizado para Diagramas Jurídicos
function LegalNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as FlujoNodeData;
  const isInicio = nodeData.tipo === "inicio";
  const isFin = nodeData.tipo === "fin";
  const isDecision = nodeData.tipo === "decision";

  let badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
  let borderHighlight = "border-blue-400";

  if (isInicio) {
    badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    borderHighlight = "border-emerald-500 ring-2 ring-emerald-200";
  } else if (isFin) {
    badgeColor = "bg-emerald-600 text-white border-emerald-600";
    borderHighlight = "border-emerald-600 shadow-md";
  } else if (isDecision) {
    badgeColor = "bg-amber-100 text-amber-850 border-amber-300";
    borderHighlight = "border-amber-400 ring-2 ring-amber-100";
  }

  return (
    <div
      className={`px-4 py-3 bg-white rounded-xl shadow-md border ${borderHighlight} min-w-[220px] max-w-[280px] text-left transition-all hover:shadow-lg`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white"
      />

      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}
        >
          {nodeData.tipo}
        </span>
        {nodeData.entidad && (
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate max-w-[140px]">
            <Building className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{nodeData.entidad}</span>
          </span>
        )}
      </div>

      <div className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">
        {nodeData.label}
      </div>

      {nodeData.description && (
        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
          {nodeData.description}
        </p>
      )}

      {(nodeData.duracion || nodeData.costo) && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          {nodeData.duracion && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{nodeData.duracion}</span>
            </div>
          )}
          {nodeData.costo && (
            <div className="flex items-center gap-1 font-semibold text-emerald-700">
              <Coins className="w-3 h-3 text-emerald-600" />
              <span>{nodeData.costo}</span>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white"
      />
    </div>
  );
}

interface FlowchartViewerProps {
  nodes: FlujoNode[];
  edges: FlujoEdge[];
  title?: string;
}

export function FlowchartViewer({ nodes, edges, title }: FlowchartViewerProps) {
  const nodeTypes = useMemo(
    () => ({
      default: LegalNodeComponent,
      inicio: LegalNodeComponent,
      paso: LegalNodeComponent,
      decision: LegalNodeComponent,
      fin: LegalNodeComponent,
    }),
    []
  );

  return (
    <div className="w-full bg-slate-900/5 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Diagrama Interactivo de Flujo Jurídico (React Flow)
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Usa el ratón o dedos para arrastrar nodos, hacer zoom y explorar la ruta procesal.
        </div>
      </div>

      <div className="h-[460px] w-full relative bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          <Controls showInteractive={false} className="bg-white rounded-lg shadow-sm border border-slate-200 text-xs" />
          <MiniMap
            zoomable
            pannable
            nodeColor={(n) => {
              const d = n.data as unknown as FlujoNodeData;
              if (d?.tipo === "inicio" || d?.tipo === "fin") return "#10b981";
              if (d?.tipo === "decision") return "#f59e0b";
              return "#3b82f6";
            }}
            className="hidden sm:block border border-slate-200 rounded-lg shadow-sm"
          />
        </ReactFlow>
      </div>

      {/* Leyenda de simbología Legal Design */}
      <div className="bg-white px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Inicio / Fin exitoso</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Paso en Institución</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Revisión / Bifurcación</span>
        </div>
      </div>
    </div>
  );
}
