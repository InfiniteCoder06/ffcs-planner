"use client";
import { cn, type ColorVariant, getColorVariant } from "@/lib/utils";
import { useScheduleStore } from "@/lib/store";
import { useMemo } from "react";
import { MotionDiv, MotionTd, ScrollAnimation } from "./ui/motion";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { days, timetableData } from "@/lib/slots";

export function Timetable() {
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
    const teacherVenueCache: Record<string, string> = {};
    const slotTeacherMap = new Map();
    const clashCache: Record<string, boolean> = {};
    const clashDetailsCache: Record<
      string,
      { teachers: string[]; courses: string[] }
    > = {};

    selectedTeachers.forEach((teacher) => {
      teacher.slots.forEach((slot) => {
        // If this slot already has a teacher, we have a clash
        if (slotTeacherMap.has(slot)) {
          clashCache[slot] = true;

          // Store clash details for tooltip
          if (!clashDetailsCache[slot]) {
            clashDetailsCache[slot] = { teachers: [], courses: [] };
          }

          const existingTeacher = slotTeacherMap.get(slot);
          const existingCourse = courses.find(
            (c) => c.id === existingTeacher.courseId,
          );
          const currentCourse = courses.find((c) => c.id === teacher.course);

          clashDetailsCache[slot].teachers.push(
            existingTeacher.name,
            teacher.name,
          );
          clashDetailsCache[slot].courses.push(
            existingCourse ? `${existingCourse.code}` : "Unknown",
            currentCourse ? `${currentCourse.code}` : "Unknown",
          );
        }

        slotTeacherMap.set(slot, {
          name: teacher.name,
          color: teacher.color,
          venue: teacher.venue || "",
          courseId: teacher.course,
        });
      });
    });

    for (const day of days) {
      for (const slot of timetableData[day]) {
        const slotKey = slot.join("/");
        const hasClash = slot.some((s) => clashCache[s]);
        const matchedTeacher = slot
          .map((s) => slotTeacherMap.get(s))
          .find(Boolean);

        if (hasClash) {
          // Special styling for clashes
          colorCache[slotKey] = getColorVariant("red", [
            "bgLight",
            "border",
            "text",
          ]);
        } else {
          colorCache[slotKey] = matchedTeacher
            ? getColorVariant(matchedTeacher.color as ColorVariant, [
                "bg",
                "text",
              ])
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }

        teacherCache[slotKey] = matchedTeacher?.name || "";
        teacherVenueCache[slotKey] = matchedTeacher?.venue || "";
      }
    }

    return {
      colorCache,
      teacherCache,
      teacherVenueCache,
      clashCache,
      clashDetailsCache,
    };
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

  // Get teacher venue for a slot
  const getVenueForSlot = (slot: string[]) => {
    const slotKey = slot.join("/");
    return timetableCache.teacherVenueCache[slotKey];
  };

  // Check if a slot has a clash
  const hasClash = (slot: string[]) => {
    return slot.some((s) => timetableCache.clashCache[s]);
  };

  // Get clash details for tooltip
  const getClashDetails = (slot: string[]) => {
    const clashingSlots = slot.filter((s) => timetableCache.clashCache[s]);
    if (clashingSlots.length === 0) return null;

    // Get unique teachers and courses from all clashing slots
    const teachers = new Set<string>();
    const courses = new Set<string>();

    clashingSlots.forEach((s) => {
      const details = timetableCache.clashDetailsCache[s];
      if (details) {
        details.teachers.forEach((t) => teachers.add(t));
        details.courses.forEach((c) => courses.add(c));
      }
    });

    return {
      teachers: Array.from(teachers),
      courses: Array.from(courses),
      slots: clashingSlots,
    };
  };

  return (
    <TooltipProvider>
      <ScrollAnimation animation="fadeIn" duration={0.8}>
        <div className="overflow-x-auto">
          <table className="w-full overflow-hidden border border-collapse divide-gray-200 rounded-lg shadow-sm dark:divide-gray-700">
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
                      <Tooltip key={slotIndex}>
                        <TooltipTrigger asChild>
                          <MotionTd
                            className={cn(
                              "border p-2 text-center text-xs transition-colors duration-200 max-w-24 overflow-hidden h-24 max-h-24",
                              getColorForSlot(slot),
                              hasClash(slot) && "relative",
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

                            {hasClash(slot) && (
                              <MotionDiv
                                className="absolute top-1 right-1"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                              >
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </MotionDiv>
                            )}
                          </MotionTd>
                        </TooltipTrigger>
                        {hasClash(slot) && (
                          <TooltipContent
                            side="top"
                            className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100"
                          >
                            <div className="p-1">
                              <p className="font-bold mb-1">
                                Slot Clash Detected!
                              </p>
                              <div className="text-xs">
                                {getClashDetails(slot)?.courses.map(
                                  (course, i) => <p key={i}>{course}</p>,
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollAnimation>
    </TooltipProvider>
  );
}
