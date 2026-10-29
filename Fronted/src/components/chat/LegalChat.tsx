"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { sendChatMessageToBackend } from "@/lib/api/backend-client";
import { ChatMessage } from "@/types";
import {
  Send,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Info,
} from "lucide-react";
import Link from "next/link";

const PROMPT_SUGGESTIONS = [
  "¿Qué documentos necesito para Derechos Reales en Cochabamba?",
  "¿Cuánto es el monto mínimo de asistencia familiar en Bolivia?",
  "¿Cómo tramitar la Licencia de Funcionamiento en la Alcaldía GAMC?",
  "¿Dónde queda el SERECI en Cochabamba para corregir mi partida?",
];

export function LegalChat() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "¡Hola! Soy tu **Asistente Legal de Cochabamba**. Estoy diseñado para traducir términos jurídicos complejos a un lenguaje claro y guiarte paso a paso en trámites de Derechos Reales, Asistencia Familiar, Alcaldía GAMC y Registro Civil. ¿En qué trámite necesitas orientación hoy?",
      timestamp: "Ahora",
      referenciasLegales: [
        "Ley 603 (Código de las Familias)",
        "Código Civil Boliviano",
        "Normativa Municipal del GAMC Cochabamba",
      ],
      accionesRecomendadas: [
        { texto: "Ver Guías Visuales", ruta: "/guias" },
        { texto: "Agendar Cita con Abogado", ruta: "/citas" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "msg-welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      // Llamada al backend FastAPI con el Access Token JWT
      const response = await sendChatMessageToBackend({
        message: textToSend.trim(),
        history,
        token,
      });

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        referenciasLegales: response.referenciasLegales,
        accionesRecomendadas: response.accionesRecomendadas,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Ocurrió un error al procesar tu consulta con el backend. Por favor intenta nuevamente o consulta directamente una de nuestras guías visuales.",
        timestamp: "Ahora",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRestart = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        role: "assistant",
        content:
          "Conversación reiniciada. ¿Qué consulta o trámite legal de Cochabamba deseas revisar ahora?",
        timestamp: "Ahora",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 1. Header con Advertencia Legal AI destacada */}
      <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Asistente Legal Cochabamba</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded font-normal">
                  FastAPI AI
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Orientación jurídica en lenguaje sencillo y comprensible
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Reiniciar chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Consulta</span>
          </button>
        </div>

        {/* Advertencia Legal Requerida */}
        <div className="mt-2.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center gap-2 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-tight">
            <strong>Aviso Legal:</strong> Asistencia Legal es un asistente AI.
            Siempre verifica trámites críticos con un profesional.
          </span>
        </div>
      </div>

      {/* 2. Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-amber-300"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Burbuja de mensaje */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Referencias Legales (Si el asistente las provee) */}
                {!isUser && msg.referenciasLegales && msg.referenciasLegales.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Fundamentos y Normas de Referencia:</span>
                    </div>
                    <ul className="space-y-1">
                      {msg.referenciasLegales.map((ref, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Acciones recomendadas con botones de enlace directo */}
                {!isUser && msg.accionesRecomendadas && msg.accionesRecomendadas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.accionesRecomendadas.map((acc, idx) => (
                      <Link
                        key={idx}
                        href={acc.ruta || "/guias"}
                        className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
                      >
                        <span>{acc.texto}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Footer del mensaje */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                      title="Copiar respuesta"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de escritura animado */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
                <span className="text-xs text-slate-500 ml-2">
                  Consultando base jurídica de Cochabamba...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Preguntas Sugeridas / Píldoras de Inicio Rápido */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Sugerencias:
        </span>
        {PROMPT_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 text-[11px] transition-colors shrink-0 disabled:opacity-50"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* 4. Barra de Entrada de Texto */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta legal (ej: ¿Cuáles son los requisitos de Derechos Reales?)..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Consultar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
