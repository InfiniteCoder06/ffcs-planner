"use client";

import { CoursesTable } from "@/components/custom-ui/course-table";
import { useTimetableCache } from "@/hooks/useTimetableCache";
import { useTotalCredits } from "@/hooks/useTotalCredits";
import { TimetableGrid } from "../ui/timetable-grid";
import { ExportTimetableHeader } from "../ui/timetable-header";

export function ExportPreview() {
  const cache = useTimetableCache();
  const totalCredits = useTotalCredits();

  return (
    <div className="print-container">
      <ExportTimetableHeader totalCredits={totalCredits} />
      <TimetableGrid cache={cache} />
      <CoursesTable totalCredits={totalCredits} />

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Generated with FFCS Planner</p>
      </div>
    </div>
  );
}
