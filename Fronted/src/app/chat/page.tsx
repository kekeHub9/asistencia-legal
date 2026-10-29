import React from "react";
import { LegalChat } from "@/components/chat/LegalChat";
import { MessageSquareText, ShieldAlert } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Chatbot Legal Asistido por IA
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consume el backend FastAPI para responder tus consultas jurídicas en lenguaje sencillo
          </p>
        </div>
      </div>

      {/* Componente del Chatbot */}
      <LegalChat />
    </div>
  );
}
