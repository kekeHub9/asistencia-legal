"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { FileText, UploadCloud, Download, ShieldCheck } from "lucide-react";

export function DocumentRepo() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Identidad");

  // 1. Cargar documentos desde Supabase al abrir la página
  const cargarDocumentos = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .eq("usuario_id", session.user.id)
      .order("created_at", { ascending: false });

    if (data) setDocumentos(data);
    if (error) console.error("Error cargando documentos:", error);
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  // 2. Función para subir el archivo a Storage y guardar en la Tabla
  const handleUpload = async () => {
    if (!selectedFile) return alert("Selecciona un archivo primero");
    
    setIsUploading(true);
    console.log("1. Iniciando subida...");

    try {
      // Obtener el usuario real
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("No hay sesión. Debes iniciar sesión.");
        return;
      }

      // Subir a Storage (con un nombre único para evitar choques)
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documentos")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      console.log("2. Archivo subido a Storage.");

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage.from("documentos").getPublicUrl(fileName);
      
      // Guardar en la tabla de la base de datos
      const { error: dbError } = await supabase.from("documentos").insert({
          usuario_id: session.user.id,
          nombre_archivo: selectedFile.name,
          categoria: categoria,
          tamano_bytes: selectedFile.size,
          tipo_mime: selectedFile.type,
          url_storage: publicUrl,
          descripcion: descripcion || "Sin descripción",
          estado: "en_revision"
      });

      if (dbError) throw dbError;
      console.log("3. Guardado en la base de datos.");

      alert("¡Éxito! Archivo guardado permanentemente.");
      
      // Limpiar formulario y recargar la lista sin refrescar toda la página
      setSelectedFile(null);
      setDescripcion("");
      cargarDocumentos(); 

    } catch (error: any) {
      console.error("Error:", error);
      alert("Error al subir: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PANEL IZQUIERDO: Subir archivo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <UploadCloud className="text-blue-600 w-5 h-5" />
          Subir Documento (Supabase Storage)
        </h2>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
            <input 
              type="file" 
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && <p className="mt-2 text-xs text-blue-600 font-semibold">Seleccionado: {selectedFile.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría</label>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm"
            >
              <option value="Identidad">Identidad</option>
              <option value="Inmuebles">Inmuebles</option>
              <option value="Tributario">Tributario</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción (Opcional)</label>
            <input 
              type="text" 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Cédula escaneada a color..."
              className="w-full border border-slate-300 rounded-lg p-2 text-sm"
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2.5 rounded-xl transition-colors"
          >
            {isUploading ? "Subiendo..." : "Subir al Repositorio"}
          </button>
        </div>
      </div>

      {/* PANEL DERECHO: Lista de documentos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="text-emerald-600 w-5 h-5" />
          Tus Documentos ({documentos.length})
        </h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {documentos.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No tienes documentos subidos.</p>
          ) : (
            documentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{doc.nombre_archivo}</p>
                    <p className="text-xs text-slate-500">{doc.categoria} • {(doc.tamano_bytes / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-semibold ${doc.estado === 'verificado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {doc.estado}
                  </span>
                  <a 
                    href={doc.url_storage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}