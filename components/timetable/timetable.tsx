"use client";
import { useMemo } from "react";
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
import { SlotSelector } from "./slot-selection";

interface TimeRange {
  start: string;
  end: string;
}

interface TeacherData {
  name: string;
  color: string;
  venue: string;
  courseId: string;
}

interface ClashDetails {
  teachers: string[];
  courses: string[];
}

const THEORY_HOURS: TimeRange[] = [
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

const LAB_HOURS: TimeRange[] = [
  { start: "08:00 AM", end: "09:40 AM" },
  { start: "09:50 AM", end: "10:40 AM" },
  { start: "10:40 AM", end: "11:30 AM" },
  { start: "", end: "" },
  { start: "2:00 PM", end: "3:40 PM" },
  { start: "3:51 PM", end: "5:30 PM" },
  { start: "5:40 PM", end: "7:20 PM" },
];

export function Timetable() {
  const { selectedTeachers, courses } = useScheduleStore();
  const { selectedSlots, toggleSlot } = manualSlotSelectionStore();

  const {
    colorCache,
    teacherCache,
    teacherVenueCache,
    clashCache,
    clashDetailsCache,
  } = useMemo(() => {
    const colorCache: Record<string, string> = {};
    const teacherCache: Record<string, string> = {};
    const venueCache: Record<string, string> = {};
    const clashCache: Record<string, boolean> = {};
    const clashDetailsCache: Record<string, ClashDetails> = {};
    const slotMap = new Map<string, TeacherData>();

    selectedTeachers.forEach(({ slots, name, color, venue = "", course }) => {
      slots.forEach((s) => {
        if (slotMap.has(s)) {
          clashCache[s] = true;
          clashDetailsCache[s] ??= { teachers: [], courses: [] };
          const existing = slotMap.get(s)!;
          const prevCourse = courses.find((c) => c.id === existing.courseId);
          const currCourse = courses.find((c) => c.id === course);
          clashDetailsCache[s].teachers.push(existing.name, name);
          clashDetailsCache[s].courses.push(
            prevCourse?.code ?? "Unknown",
            currCourse?.code ?? "Unknown",
          );
        }
        slotMap.set(s, { name, color, venue, courseId: course });
      });
    });

    for (const day of days) {
      for (const slot of timetableData[day]) {
        const key = slot.join("/");
        const hasClash = slot.some((s) => clashCache[s]);
        const data = slot.map((s) => slotMap.get(s)).find(Boolean);
        colorCache[key] = hasClash
          ? "bg-red-ui text-red-dim"
          : data
            ? `bg-${data.color}-ui text-${data.color}-dim`
            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800";
        teacherCache[key] = data?.name ?? "";
        venueCache[key] = data?.venue ?? "";
      }
    }

    return {
      colorCache,
      teacherCache,
      teacherVenueCache: venueCache,
      clashCache,
      clashDetailsCache,
    };
  }, [selectedTeachers, courses]);

  const getKey = (slot: string[]): string => slot.join("/");
  const getClashDetails = (slot: string[]) => {
    const clashed = slot.filter((s) => clashCache[s]);
    if (!clashed.length) return null;
    const teachers = new Set<string>();
    const courses = new Set<string>();
    clashed.forEach((s) => {
      clashDetailsCache[s]?.teachers.forEach((t) => teachers.add(t));
      clashDetailsCache[s]?.courses.forEach((c) => courses.add(c));
    });
    return { teachers: [...teachers], courses: [...courses], slots: clashed };
  };

  const renderCell = (slot: string[], slotIndex: number, dayIndex: number) => {
    const key = getKey(slot);
    const isClash = slot.some((s) => clashCache[s]);
    const selected = slot.some((s) => selectedSlots.includes(s));

    return (
      <Tooltip key={slotIndex}>
        <TooltipTrigger asChild>
          <MotionTd
            className={cn(
              "p-2 text-xs text-center border h-24 max-h-24 overflow-hidden transition-colors duration-200 dark:border-gray-700 hover:cursor-pointer",
              colorCache[key],
              selected &&
                "bg-yellow-4 text-black-8 dark:bg-yellowdark-7 hover:bg-yellow-4 dark:hover:bg-yellowdark-7",
              isClash && "relative",
            )}
            onClick={() => slot.forEach(toggleSlot)}
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
              <p>{teacherCache[key]}</p>
              <p>{teacherVenueCache[key]}</p>
            </MotionDiv>
            {isClash && (
              <MotionDiv
                className="absolute top-1 right-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
        {isClash && (
          <TooltipContent
            side="top"
            className="border-2 border-red-normal bg-red-ui text-red-normal"
          >
            <div className="p-1 text-xs">
              <p className="mb-1 font-bold">Slot Clash Detected!</p>
              {getClashDetails(slot)?.courses.map((course, i) => (
                <p key={i}>{course}</p>
              ))}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <SlotSelector />
      <ScrollAnimation animation="fadeIn" duration={0.8}>
        <div className="overflow-x-auto select-none">
          <table className="w-full border-collapse rounded-lg shadow-sm border divide-gray-200 dark:divide-gray-700 overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-900 font-bold">
              <tr>
                <th className="p-2 border">
                  THEORY
                  <br />
                  HOURS
                </th>
                {THEORY_HOURS.map(({ start, end }, i) => (
                  <th
                    key={i}
                    className="p-2 text-xs font-bold text-center border w-24 max-w-24 bg-blue-ui text-blue-dim"
                  >
                    {start.length > 1 ? (
                      <>
                        {start}
                        <br />
                        to
                        <br />
                        {end}
                      </>
                    ) : start === "-" ? (
                      "-"
                    ) : (
                      <div className="h-16 flex justify-center items-center">
                        LUNCH
                      </div>
                    )}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="p-2 font-bold border">
                  LAB
                  <br />
                  HOURS
                </th>
                {LAB_HOURS.map(({ start, end }, i) => (
                  <th
                    key={i}
                    colSpan={start ? 2 : 1}
                    className="p-2 text-xs font-bold text-center border w-24 max-w-24 bg-blue-ui text-blue-dim"
                  >
                    {start ? (
                      <>
                        {start}
                        <br />
                        to
                        <br />
                        {end}
                      </>
                    ) : (
                      <div className="h-16 flex justify-center items-center">
                        LUNCH
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={day}>
                  <td className="p-2 text-center font-bold border bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
                    {day}
                  </td>
                  {timetableData[day].map((slot, slotIndex) =>
                    slotIndex === 6 && dayIndex > 0 ? null : slotIndex === 6 ? (
                      <td
                        key={slotIndex}
                        className="p-2 text-center border bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
                        rowSpan={5}
                      >
                        <div className="flex items-center justify-center h-16">
                          LUNCH
                        </div>
                      </td>
                    ) : (
                      renderCell(slot, slotIndex, dayIndex)
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
