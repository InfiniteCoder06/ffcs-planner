import { useMemo } from "react";

import { useScheduleStore } from "@/lib/store";

export function useCourseMap() {
  const { courses } = useScheduleStore();

  return useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((course) => map.set(course.id, course.code));
    return map;
  }, [courses]);
}
