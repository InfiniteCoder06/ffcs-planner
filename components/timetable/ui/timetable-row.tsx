import { memo } from "react";
import { timetableData } from "@/lib/slots";
import { TimetableCell } from "@/components/timetable/ui/timetable-cell";
import { useTimetableCache } from "@/hooks/useTimetableCache";

interface TimetableRowProps {
  day: string;
  dayIndex: number;
}

export const TimetableRow = memo(function TimetableRow({
  day,
  dayIndex,
}: TimetableRowProps) {
  const cache = useTimetableCache();
  return (
    <tr>
      <td className="p-2 text-center font-bold border bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
        {day}
      </td>
      {timetableData[day].map((slot, slotIndex) => {
        // Handle lunch break
        if (slotIndex === 6) {
          return dayIndex === 0 ? (
            <td
              key={slotIndex}
              className="p-2 text-center border bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
              rowSpan={5}
            >
              <div className="flex items-center justify-center h-16">LUNCH</div>
            </td>
          ) : null;
        }

        return (
          <TimetableCell
            key={slotIndex}
            slot={slot}
            slotIndex={slotIndex}
            dayIndex={dayIndex}
            cache={cache}
          />
        );
      })}
    </tr>
  );
});
