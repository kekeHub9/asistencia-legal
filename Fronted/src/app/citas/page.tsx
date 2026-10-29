import React from "react";
import { CalendarView } from "@/components/citas/CalendarView";
import { CalendarDays } from "lucide-react";

export default function CitasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <CalendarView />
    </div>
  );
}
