"use client";

import { days, timetableData } from "@/lib/slots";
import { useScheduleStore } from "@/lib/store";
import { cn, getColorVariant, TailwindColor } from "@/lib/utils";
import { useMemo } from "react";

export function ExportPreview() {
  const { selectedTeachers, courses } = useScheduleStore();

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
    const courseCache: Record<string, string> = {};
    const venueCache: Record<string, string> = {};
    const slotTeacherMap = new Map();

    selectedTeachers.forEach((teacher) => {
      const course = courses.find((c) => c.id === teacher.course);
      teacher.slots.forEach((slot) => {
        slotTeacherMap.set(slot, {
          name: teacher.name,
          color: teacher.color,
          venue: teacher.venue || "",
          course: course?.code || "",
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
          ? getColorVariant(matchedTeacher.color as TailwindColor, [
            "bg",
            "text",
          ])
          : "bg-gray-100 text-gray-800";

        teacherCache[slotKey] = matchedTeacher?.name || "";
        courseCache[slotKey] = matchedTeacher?.course || "";
        venueCache[slotKey] = matchedTeacher?.venue || "";
      }
    }

    return { colorCache, teacherCache, courseCache, venueCache };
  }, [selectedTeachers, timetableData, days, courses]);

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

  // Get course code for a slot
  const getCourseForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.courseCache[slotKey];
  };

  // Get teacher venue for a slot
  const getVenueForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.venueCache[slotKey];
  };

  // Calculate total credits
  const totalCredits = useMemo(() => {
    return selectedTeachers.reduce((total, teacher) => {
      const course = courses.find((c) => c.id === teacher.course);
      return total + (course?.credits || 0);
    }, 0);
  }, [selectedTeachers, courses]);

  return (
    <div className="print-container">
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">FFCS Timetable</h1>
        <p className="text-sm text-gray-600">Total Credits: {totalCredits}</p>
      </div>

      <div className="overflow-auto">
        <table className="w-full overflow-hidden border border-collapse divide-gray-200 rounded-lg">
          <thead className="p-2 font-bold bg-gray-100 border">
            <tr>
              <th className="p-2 font-bold bg-gray-100 border">
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
                className="p-2 font-bold bg-gray-100 border"
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
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td className="p-2 font-bold text-center bg-gray-100 border">
                  {day}
                </td>
                {timetableData[day].map((slot, slotIndex) =>
                  slotIndex == 6 ? (
                    dayIndex == 0 ? (
                      <td
                        key={slotIndex}
                        className="p-2 text-center bg-gray-100 border"
                        rowSpan={5}
                      >
                        <div className="flex items-center justify-center h-16 text-center">
                          LUNCH
                        </div>
                      </td>
                    ) : null
                  ) : (
                    <td
                      key={slotIndex}
                      className={cn(
                        "border p-2 text-center text-xs h-24 max-h-24",
                        getColorForSlot(slot),
                      )}
                    >
                      {slot.join(" / ")}
                      <div className="mt-1 font-semibold">
                        <p>{getCourseForSlot(slot)}</p>
                        <p>{getTeacherForSlot(slot)}</p>
                        <p>{getVenueForSlot(slot)}</p>
                      </div>
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-lg font-bold">Selected Courses</h2>
        <table className="w-full overflow-hidden border border-collapse divide-gray-200 rounded-lg">
          <thead className="p-2 font-bold text-center bg-gray-100 select-none">
            <tr>
              <th className="p-2 border">Course Code</th>
              <th className="p-2 border">Course Name</th>
              <th className="p-2 border">Credits</th>
              <th className="p-2 border">Faculty</th>
              <th className="p-2 border">Venue</th>
              <th className="p-2 border">Slots</th>
            </tr>
          </thead>
          <tbody className="p-2 text-center bg-gray-100 border">
            {selectedTeachers.map((teacher) => {
              const course = courses.find((c) => c.id === teacher.course);
              return (
                <tr key={teacher.id}>
                  <td className="p-2 border">{course?.code}</td>
                  <td className="p-2 border">{course?.name}</td>
                  <td className="p-2 text-center border">{course?.credits}</td>
                  <td className="p-2 border">{teacher.name}</td>
                  <td className="p-2 border">{teacher.venue}</td>
                  <td className="p-2 border">{teacher.slots.join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-center">
              <td colSpan={2} className="p-2 text-right border">
                <strong>Total Credits:</strong>
              </td>
              <td className="p-2 text-center border">
                <strong>{totalCredits}</strong>
              </td>
              <td colSpan={3} className="p-2 border"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Generated with FFCS Planner • {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
