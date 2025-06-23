import { useMemo } from "react";
import { useScheduleStore } from "@/lib/store";

export function useTotalCredits(): number {
  const { selectedTeachers, courses } = useScheduleStore();

  return useMemo(() => {
    return selectedTeachers.reduce((total, teacher) => {
      const course = courses.find((c) => c.id === teacher.course);
      return total + (course?.credits || 0);
    }, 0);
  }, [selectedTeachers, courses]);
}
