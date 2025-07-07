import type { TimeRange } from "@/types";

import { clashMap, days, timetableData } from "./slots";

// Internal caches for performance
const concurrentSlotsCache = new Map<string, string[]>(); // Key: `${day}-${slot}` -> concurrent slots
const slotDayMapCache = new Map<string, string[]>(); // Key: slot -> days it occurs on

/**
 * Returns the time range for a specific slot on a specific day.
 * Note: This function is primarily for conceptual understanding of slot times,
 * the actual clash detection relies on `getConcurrentSlotsOnDay`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getSlotTimeRange(day: string, slot: string): TimeRange | null {
  // This function is not strictly used for clash logic, but could be useful for display.
  // For now, it's a placeholder as the timetableData structure doesn't directly map slot to time range.
  // The `timetableData` defines concurrency, which is what matters for clashes.
  return null;
}

/**
 * Returns all slots that are concurrent with a given slot on a specific day.
 * This is derived directly from the `timetableData` structure.
 */
export function getConcurrentSlotsOnDay(day: string, slot: string): string[] {
  const cacheKey = `${day}-${slot}`;
  if (concurrentSlotsCache.has(cacheKey)) {
    return concurrentSlotsCache.get(cacheKey)!;
  }

  const daySchedule = timetableData[day];
  if (!daySchedule) {
    concurrentSlotsCache.set(cacheKey, []);
    return [];
  }

  let concurrent: string[] = [];
  for (const timePeriodSlots of daySchedule) {
    if (timePeriodSlots.includes(slot)) {
      concurrent = timePeriodSlots.filter((s) => s !== ""); // Exclude empty strings
      break;
    }
  }
  concurrentSlotsCache.set(cacheKey, concurrent);
  return concurrent;
}

/**
 * Returns all days a specific slot occurs on, based on `timetableData`.
 */
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

/**
 * Determines if two slots clash, considering their days and concurrency.
 * @param day1 The day of slot1.
 * @param slot1 The first slot string.
 * @param day2 The day of slot2.
 * @param slot2 The second slot string.
 * @returns True if the slots clash, false otherwise.
 */
export const doSlotsClash = (
  day1: string,
  slot1: string,
  day2: string,
  slot2: string,
): boolean => {
  // Slots on different days do not clash.
  if (day1 !== day2) {
    return false;
  }

  // Same day, same slot means clash.
  if (slot1 === slot2) {
    return true;
  }

  // Check for manual clashes defined in `clashMap`.
  // These are considered clashes if they occur on the same day.
  const manualClashEntry = clashMap.find(
    ([a, b]) => (a === slot1 && b === slot2) || (a === slot2 && b === slot1),
  );
  if (manualClashEntry) {
    return true;
  }

  // Check for concurrency on the same day using `timetableData`.
  const concurrentSlots = getConcurrentSlotsOnDay(day1, slot1);
  return concurrentSlots.includes(slot2);
};

/**
 * Clears all internal caches used for clash detection.
 * Should be called when timetable data or selected teachers change.
 */
export const clearClashDetectionCaches = () => {
  concurrentSlotsCache.clear();
  slotDayMapCache.clear();
};
export { days, timetableData };
