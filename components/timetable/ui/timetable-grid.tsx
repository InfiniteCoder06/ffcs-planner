import { days, timetableData } from "@/lib/slots";
import { TimeRangeHeader } from "./timeslot-header";
import { TimetableCell } from "./timetable-cell";
import type { TimetableCache } from "@/types";
import { THEORY_HOURS, LAB_HOURS } from "@/lib/slots";

interface TimetableGridProps {
  cache: TimetableCache;
}

export function TimetableGrid({ cache }: TimetableGridProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse rounded-lg shadow-sm border divide-gray-200 dark:divide-gray-700 overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-900 font-bold">
          <tr>
            <th className="p-2 font-bold border">
              THEORY
              <br />
              HOURS
            </th>
            {THEORY_HOURS.map((hour, index) => (
              <TimeRangeHeader key={index} hour={hour} index={index} />
            ))}
          </tr>
          <tr>
            <th className="p-2 font-bold border">
              LAB
              <br />
              HOURS
            </th>
            {LAB_HOURS.map((hour, index) => (
              <TimeRangeHeader
                key={index}
                hour={hour}
                index={index}
                colSpan={hour.start.length === 0 ? 1 : 2}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td className="p-2 text-center font-bold border bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
                {day}
              </td>
              {timetableData[day].map((slot, slotIndex) => (
                <TimetableCell
                  key={slotIndex}
                  slot={slot}
                  slotIndex={slotIndex}
                  dayIndex={dayIndex}
                  cache={cache}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
