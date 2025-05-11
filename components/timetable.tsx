"use client";
import { cn, ColorVariant, getColorVariant } from "@/lib/utils";
import { useScheduleStore } from "@/lib/store";
import { useMemo } from "react";
import { MotionDiv, MotionTd } from "./ui/motion";

export function Timetable() {
  const { selectedTeachers } = useScheduleStore();

  const theoryHours = [
    { start: "8:00 AM", end: "8:50 AM" },
    { start: "9:00 AM", end: "9:50 AM" },
    { start: "10:00 AM", end: "10:50 AM" },
    { start: "11:00 AM", end: "11:50 AM" },
    { start: "12:00 PM", end: "12:50 PM" },
    { start: "-", end: "-" }, // Break
    { start: "", end: "" }, // Lunch
    { start: "2:00 PM", end: "2:50 PM" },
    { start: "3:00 PM", end: "3:50 PM" },
    { start: "4:00 PM", end: "4:50 PM" },
    { start: "5:00 PM", end: "5:50 PM" },
    { start: "6:00 PM", end: "6:50 PM" },
    { start: "6:51 PM", end: "7:00 PM" },
    { start: "7:01 PM", end: "7:50 PM" },
  ];

  const labHours = [
    { start: "08:00 AM", end: "09:40 AM" },
    { start: "09:50 AM", end: "10:40 AM" },
    { start: "10:40 AM", end: "11:30 AM" },
    { start: "", end: "" }, // Lunch
    { start: "2:00 PM", end: "3:40 PM" },
    { start: "3:51 PM", end: "5:30 PM" },
    { start: "5:40 PM", end: "7:20 PM" },
  ];

  const days = useMemo(() => ["MON", "TUE", "WED", "THU", "FRI"], []);

  type Slot = string[];
  type Day = (typeof days)[number];
  type TimetableData = Record<Day, Slot[]>;

  const timetableData = useMemo<TimetableData>(
    () => ({
      MON: [
        ["A1", "L1"],
        ["F1", "L2"],
        ["D1", "L3"],
        ["TB1", "L4"],
        ["TG1", "L5"],
        ["L6"],
        [""],
        ["A2", "L31"],
        ["F2", "L32"],
        ["D2", "L33"],
        ["TB2", "L34"],
        ["TG2", "L35"],
        ["L36"],
        ["V3"],
      ],
      TUE: [
        ["B1", "L7"],
        ["G1", "L8"],
        ["E1", "L9"],
        ["TC1", "L10"],
        ["TAA1", "L11"],
        ["L12"],
        [""],
        ["B2", "L37"],
        ["G2", "L38"],
        ["E2", "L39"],
        ["TC2", "L40"],
        ["TAA2", "L41"],
        ["L42"],
        ["V4"],
      ],
      WED: [
        ["C1", "L13"],
        ["A1", "L14"],
        ["F1", "L15"],
        ["V1", "L16"],
        ["V2", "L17"],
        ["L18"],
        [""],
        ["C2", "L43"],
        ["A2", "L44"],
        ["F2", "L45"],
        ["TD2", "L46"],
        ["TBB2", "L47"],
        ["L48"],
        ["V5"],
      ],
      THU: [
        ["D1", "L19"],
        ["B1", "L20"],
        ["G1", "L21"],
        ["TE1", "L22"],
        ["TCC1", "L23"],
        ["L24"],
        [""],
        ["D2", "L49"],
        ["B2", "L50"],
        ["G2", "L51"],
        ["TE2", "L52"],
        ["TCC2", "L53"],
        ["L54"],
        ["V6"],
      ],
      FRI: [
        ["E1", "L25"],
        ["C1", "L26"],
        ["TA1", "L27"],
        ["TF1", "L28"],
        ["TD1", "L29"],
        ["L30"],
        [""],
        ["E2", "L55"],
        ["C2", "L56"],
        ["TA2", "L57"],
        ["TF2", "L58"],
        ["TDD2", "L59"],
        ["L60"],
        ["V7"],
      ],
    }),
    [],
  );

  // Optimize by creating a single pass calculation
  const timetableCache = useMemo(() => {
    const colorCache: Record<string, string> = {};
    const teacherCache: Record<string, string> = {};
    const teacherVenueCache: Record<string, string> = {};
    const slotTeacherMap = new Map();

    selectedTeachers.forEach((teacher) => {
      teacher.slots.forEach((slot) => {
        slotTeacherMap.set(slot, {
          name: teacher.name,
          color: teacher.color,
          venue: teacher.venue || "",
        });
      });
    });

    for (const day of days) {
      for (const slot of timetableData[day]) {
        const slotKey = slot.join("/");
        const matchedTeacher = slot
          .map((s) => slotTeacherMap.get(s))
          .find(Boolean);

        colorCache[slotKey] = matchedTeacher
          ? getColorVariant(matchedTeacher.color as ColorVariant, [
              "bg",
              "text",
            ])
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

        teacherCache[slotKey] = matchedTeacher?.name || "";
        teacherVenueCache[slotKey] = matchedTeacher?.venue || "";
      }
    }

    return { colorCache, teacherCache, teacherVenueCache };
  }, [selectedTeachers, timetableData, days]);

  // Use the cache when rendering
  const getColorForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.colorCache[slotKey];
  };

  // Get teacher name for a slot
  const getTeacherForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.teacherCache[slotKey];
  };

  // Get teacher venue for a slot
  const getVenueForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.teacherVenueCache[slotKey];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full overflow-hidden border-collapse divide-gray-200 rounded-lg dark:divide-gray-700">
        <thead className="p-2 font-bold bg-gray-100 border dark:bg-gray-800">
          <tr>
            <th className="p-2 font-bold bg-gray-100 border dark:bg-gray-800">
              THEORY
              <br />
              HOURS
            </th>
            {theoryHours.map((hour, index) => (
              <th
                key={index}
                className={cn(
                  "p-2 text-xs font-bold text-center border w-24 max-w-24",
                  getColorVariant("blue", ["bg", "text"]),
                )}
              >
                {hour.start.length > 1 && (
                  <>
                    {hour.start}
                    <br />
                    to
                    <br />
                    {hour.end}
                  </>
                )}
                {hour.start.length == 1 && <>-</>}
                {!hour.start && (
                  <div className="flex items-center justify-center h-16">
                    LUNCH
                  </div>
                )}
              </th>
            ))}
          </tr>
          <tr>
            <th
              key={"lab-hours"}
              className="p-2 font-bold bg-gray-100 border dark:bg-gray-800"
            >
              LAB
              <br />
              HOURS
            </th>
            {labHours.map((hour, index) => (
              <th
                key={index}
                className={cn(
                  "p-2 text-xs font-bold text-center border w-24 max-w-24",
                  getColorVariant("blue", ["bg", "text"]),
                )}
                colSpan={hour.start.length == 0 ? 1 : 2}
              >
                {hour.start && (
                  <>
                    {hour.start}
                    <br />
                    to
                    <br />
                    {hour.end}
                  </>
                )}
                {!hour.start && (
                  <div className="flex items-center justify-center h-16 text-center">
                    LUNCH
                  </div>
                )}
              </th>
            ))}
            <th
              className={cn("p-2", getColorVariant("blue", ["bg", "text"]))}
            ></th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td className="p-2 font-bold text-center bg-gray-100 border dark:bg-gray-800 dark:border-gray-700">
                {day}
              </td>
              {timetableData[day].map((slot, slotIndex) =>
                slotIndex == 6 ? (
                  dayIndex == 0 ? (
                    <td
                      key={slotIndex}
                      className="p-2 text-center bg-gray-100 border dark:bg-gray-800"
                      rowSpan={5}
                    >
                      <div className="flex items-center justify-center h-16 text-center">
                        LUNCH
                      </div>
                    </td>
                  ) : null
                ) : (
                  <MotionTd
                    key={slotIndex}
                    className={cn(
                      "border p-2 text-center text-xs transition-colors duration-200 max-w-24 overflow-hidden h-24 max-h-24",
                      getColorForSlot(slot),
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: slotIndex * 0.01,
                      duration: 0.3,
                    }}
                  >
                    {slot.join(" / ")}
                    <MotionDiv
                      className="mt-1 font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p>{getTeacherForSlot(slot)}</p>
                      <p>{getVenueForSlot(slot)}</p>
                    </MotionDiv>
                  </MotionTd>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
