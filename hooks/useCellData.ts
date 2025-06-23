import { useMemo } from "react";
import { useSlotData } from "./useSlotData";
import { useTimetableCache } from "./useTimetableCache";
import type { CellData } from "@/types";

export function useCellData(): CellData {
  const { clashCache } = useSlotData();
  const { colorCache, teacherCache, venueCache } =
    useTimetableCache(clashCache);

  return useMemo(() => {
    return { colorCache, teacherCache, venueCache };
  }, [colorCache, teacherCache, venueCache]);
}
