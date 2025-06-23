import { useCallback } from "react";
import { useSlotData } from "./useSlotData";
import type { ClashDetails } from "@/types";

export function useClashDetails() {
  const { clashCache, clashDetailsCache } = useSlotData();

  return useCallback(
    (slot: string[]): ClashDetails | null => {
      const clashed = slot.filter((s) => clashCache[s]);
      if (!clashed.length) return null;

      const teachers = new Set<string>();
      const courses = new Set<string>();
      const slots = new Set<string>();

      clashed.forEach((s) => {
        const details = clashDetailsCache[s];
        if (details) {
          details.teachers.forEach((t) => teachers.add(t));
          details.courses.forEach((c) => courses.add(c));
          details.slots.forEach((sl) => slots.add(sl));
        }
      });

      return {
        teachers: [...teachers],
        courses: [...courses],
        slots: [...slots],
      };
    },
    [clashCache, clashDetailsCache],
  );
}
