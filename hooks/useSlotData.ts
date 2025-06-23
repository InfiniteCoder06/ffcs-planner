import { useMemo } from "react";
import { useScheduleStore } from "@/lib/store";
import { useCourseMap } from "./useCourseMap";
import type { ClashDetails } from "@/types";

export function useSlotData() {
  const { selectedTeachers } = useScheduleStore();
  const courseMap = useCourseMap();

  return useMemo(() => {
    const clashCache: Record<string, boolean> = {};
    const clashDetailsCache: Record<string, ClashDetails> = {};
    const slotOccupancy = new Map<string, { name: string; courseId: string }>();

    selectedTeachers.forEach(({ slots, name, course }) => {
      slots.forEach((slot) => {
        if (slotOccupancy.has(slot)) {
          // Mark as clash
          clashCache[slot] = true;

          // Initialize clash details if not exists
          if (!clashDetailsCache[slot]) {
            clashDetailsCache[slot] = { teachers: [], courses: [], slots: [] };
          }

          const existing = slotOccupancy.get(slot)!;
          const prevCourse = courseMap.get(existing.courseId) ?? "Unknown";
          const currCourse = courseMap.get(course) ?? "Unknown";

          // Add to clash details
          clashDetailsCache[slot].teachers.push(existing.name, name);
          clashDetailsCache[slot].courses.push(prevCourse, currCourse);
          clashDetailsCache[slot].slots.push(slot);
        }

        slotOccupancy.set(slot, { name, courseId: course });
      });
    });

    return { clashCache, clashDetailsCache };
  }, [selectedTeachers, courseMap]);
}
