"use client";
import { cn, type ColorVariant, getColorVariant } from "@/lib/utils";
import { useScheduleStore } from "@/lib/store";
import { useMemo } from "react";
import { MotionDiv, MotionTd, ScrollAnimation } from "./ui/motion";
import { days, timetableData } from "@/lib/slots";

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
    <ScrollAnimation animation="fadeIn" duration={0.8}>
      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="w-full overflow-hidden border border-collapse divide-gray-200 rounded-lg dark:divide-gray-700">
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
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: slotIndex * 0.01 + dayIndex * 0.03,
                      }}
                    >
                      {slot.join(" / ")}
                      <MotionDiv
                        className="mt-1 font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
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
    </ScrollAnimation>
  );
}
