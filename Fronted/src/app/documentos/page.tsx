import React from "react";
import { DocumentRepo } from "@/components/documentos/DocumentRepo";

export default function DocumentosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DocumentRepo />
    </div>
  );
}
