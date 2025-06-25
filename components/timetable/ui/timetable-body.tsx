import { memo } from "react";
import { days } from "@/lib/slots";
import { TimetableRow } from "@/components/timetable/ui/timetable-row";
import type { TimetableRenderData } from "@/types";

interface TimetableBodyProps {
  cellsData: TimetableRenderData["cellsData"];
}

export const TimetableBody = memo(function TimetableBody({
  cellsData,
}: TimetableBodyProps) {
  return (
    <tbody>
      {days.map((day, dayIndex) => (
        <TimetableRow
          key={day}
          day={day}
          dayIndex={dayIndex}
          cellsDataForDay={cellsData[day]}
        />
      ))}
    </tbody>
  );
});
