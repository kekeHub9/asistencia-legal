"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { checkBackendHealth, BackendStatus } from "@/lib/api/backend-client";
import { UserRole } from "@/types";
import {
  Scale,
  MessageSquareText,
  CalendarDays,
  FolderLock,
  Compass,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Server,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, switchRole, signOut, signInWithGoogle, isSupabaseLive } =
    useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    isOnline: false,
    url: "http://localhost:8000",
  });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    checkBackendHealth().then((status) => setBackendStatus(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setBackendStatus(status));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/guias", label: "Guías Visuales", icon: Compass },
    { href: "/chat", label: "Chatbot Legal", icon: MessageSquareText },
    { href: "/citas", label: "Gestión de Citas", icon: CalendarDays },
    { href: "/documentos", label: "Documentos", icon: FolderLock },
  ];

  if (role === "administrador") {
    navLinks.push({ href: "/admin", label: "Panel Admin", icon: ShieldCheck });
  }

  const roleColors: Record<UserRole, string> = {
    ciudadano: "bg-emerald-50 text-emerald-700 border-emerald-200",
    abogado: "bg-blue-50 text-blue-700 border-blue-200",
    administrador: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Barra superior de estado / contexto Cochabamba */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            Sistema de Asistencia Legal Visual &bull; Cochabamba, Bolivia
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Indicador de Backend FastAPI */}
          <div
            className="flex items-center gap-1.5 text-xs"
            title={
              backendStatus.isOnline
                ? "Backend FastAPI respondiendo en " + backendStatus.url
                : "FastAPI offline. Modo demostración activo con simulación."
            }
          >
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">FastAPI:</span>
            {backendStatus.isOnline ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Conectado (8000)
              </span>
            ) : (
              <span className="text-amber-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Simulado (Offline)
              </span>
            )}
          </div>

          {/* Indicador de Supabase */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
            <span>Supabase:</span>
            {isSupabaseLive ? (
              <span className="text-emerald-400 font-medium">Cloud RLS</span>
            ) : (
              <span className="text-slate-300">Modo Local</span>
            )}
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logotipo y Título Legal Design */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-blue-800 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-lg">
                Asistencia Legal
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-sm">
                Cbba
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Comprensión visual de trámites ciudadanos
            </p>
          </div>
        </Link>

        {/* Enlaces Principales de Navegación (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Controles de Usuario y Selector de Roles */}
        <div className="hidden md:flex items-center gap-3">
          {/* Selector Rápido de Rol (Para pruebas y evaluación) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${roleColors[role]}`}
              title="Cambiar rol para evaluar la perspectiva de Ciudadano, Abogado o Administrador"
            >
              <span>Rol: {role}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar Rol de Prueba
                </div>
                {(["ciudadano", "abogado", "administrador"] as UserRole[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between capitalize transition-colors ${
                        role === r
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Perfil o Botón Google OAuth */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center text-blue-700 font-bold text-xs">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.fullName.charAt(0)
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </Link>
          )}
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Cambiar Rol de Demostración:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["ciudadano", "abogado", "administrador"] as UserRole[]).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded text-xs capitalize text-center font-medium border ${
                      role === r
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">{user.fullName}</p>
                    <p className="text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-red-600 font-medium px-2 py-1 rounded bg-red-50"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Ingresar con Google
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
