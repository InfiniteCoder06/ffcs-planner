import { useMemo } from "react";
import { days, timetableData } from "@/lib/slots";
import { useScheduleStore } from "@/lib/store";
import { TimetableCache, TeacherInfo } from "@/types";

export function useTimetableCache(
  clashCache?: Record<string, boolean>,
): TimetableCache {
  const { selectedTeachers, courses } = useScheduleStore();

  return useMemo(() => {
    const colorCache: Record<string, string> = {};
    const teacherCache: Record<string, string> = {};
    const courseCache: Record<string, string> = {};
    const venueCache: Record<string, string> = {};
    const slotTeacherMap = new Map<string, TeacherInfo>();

    // Build slot-teacher mapping
    selectedTeachers.forEach((teacher) => {
      const course = courses.find((c) => c.id === teacher.course);
      const teacherInfo: TeacherInfo = {
        name: teacher.name,
        color: teacher.color,
        venue: teacher.venue || "",
        course: course?.code || "",
      };

      teacher.slots.forEach((slot) => {
        slotTeacherMap.set(slot, teacherInfo);
      });
    });

    // Build caches for all slots
    for (const day of days) {
      for (const slot of timetableData[day]) {
        const slotKey = slot.join("/");
        const matchedTeacher = slot
          .map((s) => slotTeacherMap.get(s))
          .find(Boolean);

        colorCache[slotKey] = matchedTeacher
          ? `bg-${matchedTeacher.color}-ui text-${matchedTeacher.color}-dim`
          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800";

        teacherCache[slotKey] = matchedTeacher?.name || "";
        courseCache[slotKey] = matchedTeacher?.course || "";
        venueCache[slotKey] = matchedTeacher?.venue || "";
      }
    }

    return { colorCache, teacherCache, courseCache, venueCache };
  }, [selectedTeachers, courses, clashCache]);
}
