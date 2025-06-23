"use client";
import { MotionDiv, MotionTd, ScrollAnimation } from "@/components/ui/motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { days, timetableData } from "@/lib/slots";
import { manualSlotSelectionStore, useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { SlotSelector } from "./slot-selection";

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
  const { selectedSlots, toggleSlot } = manualSlotSelectionStore();

  const isManualSlotSelected = (slots: string[]) => {
    const isSelected = slots.some((s) => selectedSlots.includes(s));
    return isSelected;
  };

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
        if (slotTeacherMap.has(slot)) {
          clashCache[slot] = true;
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
            existingCourse?.code || "Unknown",
            currentCourse?.code || "Unknown",
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

        colorCache[slotKey] = hasClash
          ? "bg-red-ui text-red-dim"
          : matchedTeacher
            ? `bg-${matchedTeacher.color}-ui text-${matchedTeacher.color}-dim`
            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

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
  }, [selectedTeachers, courses]);

  const getSlotKey = (slot: string[]) => slot.join("/");
  const getColorForSlot = (slot: string[]) =>
    timetableCache.colorCache[getSlotKey(slot)];
  const getTeacherForSlot = (slot: string[]) =>
    timetableCache.teacherCache[getSlotKey(slot)];
  const getVenueForSlot = (slot: string[]) =>
    timetableCache.teacherVenueCache[getSlotKey(slot)];
  const hasClash = (slot: string[]) =>
    slot.some((s) => timetableCache.clashCache[s]);

  const getClashDetails = (slot: string[]) => {
    const clashingSlots = slot.filter((s) => timetableCache.clashCache[s]);
    if (!clashingSlots.length) return null;

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
      <SlotSelector />
      <ScrollAnimation animation="fadeIn" duration={0.8}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow-sm border divide-gray-200 dark:divide-gray-700 overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-900 font-bold">
              <tr>
                <th className="p-2 border">
                  THEORY
                  <br />
                  HOURS
                </th>
                {theoryHours.map((hour, i) => (
                  <th
                    key={i}
                    className={cn(
                      "p-2 text-xs font-bold text-center border w-24 max-w-24",
                      "bg-blue-ui text-blue-dim",
                    )}
                  >
                    {hour.start.length > 1 ? (
                      <>
                        {hour.start}
                        <br />
                        to
                        <br />
                        {hour.end}
                      </>
                    ) : hour.start.length === 1 ? (
                      <>-</>
                    ) : (
                      <div className="flex items-center justify-center h-16">
                        LUNCH
                      </div>
                    )}
                  </th>
                ))}
              </tr>
              <tr>
                <th key={"lab-hours"} className="p-2 font-boldborder">
                  LAB
                  <br />
                  HOURS
                </th>
                {labHours.map((hour, i) => (
                  <th
                    key={i}
                    className={cn(
                      "p-2 text-xs font-bold text-center border w-24 max-w-24",
                      "bg-blue-ui text-blue-dim",
                    )}
                    colSpan={hour.start ? 2 : 1}
                  >
                    {hour.start ? (
                      <>
                        {hour.start}
                        <br />
                        to
                        <br />
                        {hour.end}
                      </>
                    ) : (
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
                  <td className="p-2 text-center font-bold border bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
                    {day}
                  </td>
                  {timetableData[day].map((slot, slotIndex) =>
                    slotIndex === 6 ? (
                      dayIndex === 0 ? (
                        <td
                          key={slotIndex}
                          className="p-2 text-center border bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
                          rowSpan={5}
                        >
                          <div className="flex items-center justify-center h-16">
                            LUNCH
                          </div>
                        </td>
                      ) : null
                    ) : (
                      <Tooltip key={slotIndex}>
                        <TooltipTrigger asChild>
                          <MotionTd
                            className={cn(
                              "p-2 text-xs text-center border h-24 max-h-24 overflow-hidden transition-colors duration-200 dark:border-gray-700",
                              hasClash(slot) && "relative",
                              getColorForSlot(slot),
                              isManualSlotSelected(slot) &&
                                "bg-yellow-solid text-yellow-normal",
                            )}
                            onClick={() => {
                              const slotKey = getSlotKey(slot);
                              const slots = slotKey.split("/");

                              slots.forEach((s) => {
                                toggleSlot(s);
                              });
                            }}
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
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                                whileHover={{
                                  rotate: [0, -10, 10, -10, 0],
                                  transition: { duration: 0.5 },
                                }}
                              >
                                <AlertCircle className="h-4 w-4 text-red-normal" />
                              </MotionDiv>
                            )}
                          </MotionTd>
                        </TooltipTrigger>
                        {hasClash(slot) && (
                          <TooltipContent
                            side="top"
                            className="border-2 border-red-normal bg-red-ui text-red-normal"
                          >
                            <div className="p-1">
                              <p className="mb-1 font-bold">
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
