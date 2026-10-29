"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_USERS } from "@/lib/mock-data";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  token: string | null;
  role: UserRole;
  isLoading: boolean;
  isSupabaseLive: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithDemo: (role: UserRole) => void;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("ciudadano");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsSupabaseLive(configured);

    if (configured) {
      // 1. Obtener sesión activa de Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          applySupabaseSession(session);
        } else {
          // Inicializar por defecto con usuario demo ciudadano para pruebas inmediatas
          loadDemoUser("ciudadano");
        }
        setIsLoading(false);
      });

      // 2. Escuchar cambios de estado de auth
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          applySupabaseSession(session);
        } else {
          setSupabaseUser(null);
          setSession(null);
          setToken(null);
          loadDemoUser("ciudadano");
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Modo local/demo predeterminado
      loadDemoUser("ciudadano");
      setIsLoading(false);
    }
  }, []);

  const applySupabaseSession = (sess: Session) => {
    setSession(sess);
    setSupabaseUser(sess.user);
    setToken(sess.access_token);

    // Extraer rol de app_metadata o user_metadata si existe
    const assignedRole =
      (sess.user.user_metadata?.role as UserRole) ||
      (sess.user.app_metadata?.role as UserRole) ||
      "ciudadano";

    setRole(assignedRole);

    setUser({
      id: sess.user.id,
      email: sess.user.email || "usuario@cochabamba.legal",
      fullName:
        sess.user.user_metadata?.full_name ||
        sess.user.user_metadata?.name ||
        sess.user.email?.split("@")[0] ||
        "Ciudadano Cochabambino",
      role: assignedRole,
      avatarUrl:
        sess.user.user_metadata?.avatar_url ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
      phone: "+591 71458920",
      department: "Cochabamba",
    });
  };

  const loadDemoUser = (userRole: UserRole) => {
    const mock = MOCK_USERS.find((u) => u.role === userRole) || MOCK_USERS[0];
    setUser(mock);
    setRole(userRole);
    setToken(`demo-jwt-token-${userRole}-${Date.now()}`);
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Si las llaves de Supabase aún no están en .env.local, usar modo demo
      loadDemoUser("ciudadano");
      return {};
    }

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con Google";
      return { error: msg };
    }
  };

  const signInWithDemo = (demoRole: UserRole) => {
    loadDemoUser(demoRole);
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setToken(null);
    loadDemoUser("ciudadano");
  };

  const switchRole = (newRole: UserRole) => {
    loadDemoUser(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        token,
        role,
        isLoading,
        isSupabaseLive,
        signInWithGoogle,
        signInWithDemo,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
