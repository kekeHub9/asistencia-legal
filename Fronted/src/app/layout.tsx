import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Asistencia Legal Cochabamba | Guías Visuales y Trámites",
  description:
    "Sistema web con asistencia legal visual y gestión automatizada para mejorar la comprensión de procesos legales de los ciudadanos de Cochabamba (Bolivia).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
