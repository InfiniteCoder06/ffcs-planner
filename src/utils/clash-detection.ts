import { Teacher } from "@/types";

import { clashMapping, days, timetableData } from "../constants/timetable";
import { getAllSlots } from "./timetable";

export function hasClashUsingMap(
  teacher1: Teacher,
  teacher2: Teacher,
): string[] {
  const teacher1Slots = getAllSlots(teacher1);
  const teacher2Slots = getAllSlots(teacher2);

  const clashes = new Set<string>();

  for (const slot1 of teacher1Slots) {
    for (const slot2 of teacher2Slots) {
      if (slot1 === slot2) {
        clashes.add(slot1);
        continue;
      }

      if (
        clashMapping[slot1]?.includes(slot2) ||
        clashMapping[slot2]?.includes(slot1)
      ) {
        clashes.add(slot1);
        clashes.add(slot2);
      }
    }
  }

  return [...clashes];
}

export function hasClashEnhanced(
  teacher: Teacher,
  teachers: Teacher[],
): Teacher[] {
  return teachers.filter((otherTeacher) => {
    const clashes = hasClashUsingMap(teacher, otherTeacher);
    return clashes.length > 0;
  });
}

export function hasClashSlot(slot: string, teacher: Teacher): boolean {
  const allSlots = getAllSlots(teacher);

  return (
    allSlots.includes(slot) ||
    clashMapping[slot]?.some((s) => allSlots.includes(s))
  );
}

export function hasClashSlotEnhanced(
  slot: string,
  teachers: Teacher[],
): Teacher[] {
  return teachers.filter((teacher) => hasClashSlot(slot, teacher));
}

const slotDayMapCache = new Map<string, string[]>();

export function getDaysForSlot(slot: string): string[] {
  if (slotDayMapCache.has(slot)) {
    return slotDayMapCache.get(slot)!;
  }

  const occurringDays: string[] = [];
  for (const day of days) {
    const daySchedule = timetableData[day];
    for (const timePeriodSlots of daySchedule) {
      if (timePeriodSlots.includes(slot)) {
        occurringDays.push(day);
        break; // Found it for this day, move to next day
      }
    }
  }
  slotDayMapCache.set(slot, occurringDays);
  return occurringDays;
}

export const clearClashDetectionCaches = () => {
  slotDayMapCache.clear();
};
