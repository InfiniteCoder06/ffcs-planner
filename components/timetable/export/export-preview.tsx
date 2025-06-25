"use client";

import { CoursesTable } from "@/components/custom-ui/course-table";
import { TimetableGrid } from "../ui/timetable-grid";
import { ExportTimetableHeader } from "../ui/timetable-header";
import { useTimetableRenderData } from "@/hooks/useTimetableRenderData";

export function ExportPreview() {
  const { cellsData, totalCredits } = useTimetableRenderData();

  return (
    <div className="print-container">
      <ExportTimetableHeader totalCredits={totalCredits} />
      <TimetableGrid cellsData={cellsData} />
      <CoursesTable totalCredits={totalCredits} />

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Generated with FFCS Planner</p>
      </div>
    </div>
  );
}
