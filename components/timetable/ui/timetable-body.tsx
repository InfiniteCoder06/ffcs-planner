import { memo } from "react";
import { days } from "@/lib/slots";
import { TimetableRow } from "@/components/timetable/ui/timetable-row";

export const TimetableBody = memo(function TimetableBody() {
  return (
    <tbody>
      {days.map((day, dayIndex) => (
        <TimetableRow key={day} day={day} dayIndex={dayIndex} />
      ))}
    </tbody>
  );
});
