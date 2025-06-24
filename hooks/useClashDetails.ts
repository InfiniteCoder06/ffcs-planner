import { useCallback } from "react";
import { useScheduleStore } from "@/lib/store";

export function useClashDetails() {
  const { getSlotClashes, getCourse } = useScheduleStore();

  return useCallback(
    (slots: string[]) => {
      // Check if any of the slots have clashes
      const allClashes = slots.flatMap((slot) => getSlotClashes(slot));

      if (allClashes.length === 0) return null;

      // Get course names for the clashing teachers
      const courses = allClashes.flatMap((clash) => {
        const course1 = getCourse(clash.teacher1.course);
        const course2 = getCourse(clash.teacher2.course);

        const course1Name = course1
          ? `${course1.code} - ${course1.name} (${clash.teacher1.name})`
          : `Unknown Course (${clash.teacher1.name})`;
        const course2Name = course2
          ? `${course2.code} - ${course2.name} (${clash.teacher2.name})`
          : `Unknown Course (${clash.teacher2.name})`;

        return [course1Name, course2Name];
      });

      // Remove duplicates
      const uniqueCourses = [...new Set(courses)];

      return {
        courses: uniqueCourses,
        clashes: allClashes,
      };
    },
    [getSlotClashes, getCourse],
  );
}
