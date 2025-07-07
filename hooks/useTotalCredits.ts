import { useMemo } from "react";

import { useScheduleStore } from "@/lib/store";

export function useTotalCredits(): number {
  const { getSelectedTeachers, courses } = useScheduleStore();

  return useMemo(() => {
    const selectedTeachers = getSelectedTeachers();
    return selectedTeachers.reduce((total, teacher) => {
      const course = courses.find((c) => c.id === teacher.course);
      return total + (course?.credits || 0);
    }, 0);
  }, [getSelectedTeachers, courses]);
}
