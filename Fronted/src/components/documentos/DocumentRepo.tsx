"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserDocumentos } from "@/lib/supabase/client";
import {
  uploadDocumentoBackend,
  downloadDocumentoBackend,
} from "@/lib/api/backend-client";
import { Documento } from "@/types";
import {
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderLock,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

export function DocumentRepo() {
  const { user, token } = useAuth();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Inmuebles");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadDocumentos = async () => {
    setIsLoading(true);
    try {
      const docs = await getUserDocumentos(user?.id || "usr-ciudadano-001");
      setDocumentos(docs);
    } catch (err) {
      console.error("Error cargando documentos de Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentos();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Subir archivo: POST {BACKEND_URL}/api/documentos/upload multipart con JWT
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const res = await uploadDocumentoBackend({
        file: selectedFile,
        categoria: selectedCategory,
        descripcion: description || `Documento legal (${selectedFile.name})`,
        token,
      });

      if (res.success && res.documento) {
        setDocumentos((prev) => [res.documento!, ...prev]);
        setUploadStatus({
          type: "success",
          message:
            "¡Archivo subido exitosamente a Supabase Storage vía FastAPI!",
        });
        setSelectedFile(null);
        setDescription("");
      } else {
        setUploadStatus({
          type: "error",
          message: res.error || "No se pudo subir el archivo al backend.",
        });
      }
    } catch {
      setUploadStatus({
        type: "error",
        message: "Error de red al conectar con el backend de carga.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Descargar archivo: GET {BACKEND_URL}/api/documentos/:id/download
  const handleDownload = async (doc: Documento) => {
    try {
      const url = await downloadDocumentoBackend({
        docId: doc.id,
        token,
      });
      // Abrir en nueva ventana o descargar
      window.open(url, "_blank");
    } catch {
      alert("No se pudo iniciar la descarga desde el backend.");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "verificado":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verificado
          </span>
        );
      case "en_revision":
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            En revisión
          </span>
        );
      case "observado":
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Observado
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-full">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Repositorio Documental del Ciudadano
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Almacenamiento seguro en Supabase Storage protegido por RLS. Subidas procesadas con validación por FastAPI.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cifrado y RLS Activo</span>
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
            uploadStatus.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Grid: Subir a la izquierda, Listar a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Subida Multipart con FastAPI (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Subir Documento (FastAPI)
            </h3>
          </div>

          <form onSubmit={handleUpload} className="space-y-4 text-xs sm:text-sm">
            {/* Zona de Drop / Selección de Archivo */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-blue-600 hover:underline">
                    Haz clic para seleccionar
                  </span>{" "}
                  o arrastra tu archivo aquí
                </div>
                <p className="text-[11px] text-slate-400">
                  PDF, JPG o PNG hasta 10 MB (Folio Real, Cédula, IMT, etc.)
                </p>
              </label>

              {selectedFile && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs text-slate-800">
                  <span className="truncate max-w-[200px] font-medium">
                    {selectedFile.name}
                  </span>
                  <span className="text-slate-400">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
              )}
            </div>

            {/* Categoría del Documento */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo o Categoría del Documento *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inmuebles">Inmuebles (Folio Real, Testimonio)</option>
                <option value="Identidad">Identidad (Cédula de Identidad C.I.)</option>
                <option value="Tributario Municipal">
                  Tributario Municipal (Pago IMT, GAMC)
                </option>
                <option value="SERECI">SERECI (Certificados de Nacimiento)</option>
                <option value="Memoriales">Memoriales y Demandas Judiciales</option>
                <option value="Otros">Otros Documentos Legales</option>
              </select>
            </div>

            {/* Descripción Breve */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Descripción o Notas Adicionales
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Folio Real original escaneado con sello seco..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>
                {isUploading ? "Cargando vía FastAPI..." : "Subir al Repositorio"}
              </span>
            </button>
          </form>
        </div>

        {/* Lista de Documentos Propios (Lectura directa Supabase RLS) (7 columnas) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tus Documentos Almacenados (Supabase RLS)
              </h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
              {documentos.length} archivos
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[520px]">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Consultando documentos en Supabase con RLS...
              </div>
            ) : documentos.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Aún no has subido ningún documento legal a tu repositorio.
                </p>
              </div>
            ) : (
              documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {doc.nombreArchivo}
                      </h4>
                      {doc.descripcion && (
                        <p className="text-[11px] text-slate-500 truncate">
                          {doc.descripcion}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                          {doc.categoria}
                        </span>
                        <span>&bull;</span>
                        <span>{formatBytes(doc.tamañoBytes)}</span>
                        <span>&bull;</span>
                        <span>
                          {new Date(doc.fechaSubida).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {getStatusBadge(doc.estado)}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                      title="Descargar archivo vía FastAPI (URL firmada)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
