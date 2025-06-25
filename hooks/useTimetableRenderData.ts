"use client";

import { useMemo } from "react";
import { useScheduleStore, manualSlotSelectionStore } from "@/lib/store";
import {
  timetableData,
  days,
  getDaysForSlot,
  doSlotsClash,
} from "@/lib/clash-detection"; // Import doSlotsClash and getDaysForSlot from clash-detection
import type { TimetableRenderData, CellRenderData } from "@/types";
import { useTotalCredits } from "./useTotalCredits";
import type { Teacher } from "@/types";

/**
 * Custom hook to prepare all data required for rendering the timetable,
 * including teacher info, course info, venue, colors, and pre-computed clash states.
 */
export function useTimetableRenderData(): TimetableRenderData {
  const { getSelectedTeachers, courses, getAllClashes } = useScheduleStore();
  const { manualSelectedSlots } = manualSlotSelectionStore();
  const totalCredits = useTotalCredits();

  const selectedTeachers = getSelectedTeachers();

  // Memoize all clashes
  const allClashes = useMemo(() => getAllClashes(), [getAllClashes]);
  const allClashesCount = allClashes.length;

  const cellsData = useMemo(() => {
    const cells: Record<string, Record<string, CellRenderData>> = {};

    // Create maps for quick lookups
    const courseCodeMap = new Map(courses.map((c) => [c.id, c.code]));
    // const selectedTeacherMap = new Map(selectedTeachers.map((t) => [t.id, t]));
    const teacherToSlotsMap = new Map<string, string[]>(); // teacherId -> [slot1, slot2, ...]

    selectedTeachers.forEach((teacher) => {
      teacherToSlotsMap.set(teacher.id, teacher.slots);
    });

    // Populate a reverse map of slot -> teachers occupying it
    const slotOccupancyMap = new Map<
      string,
      { teacher: Teacher; day: string }[]
    >();

    selectedTeachers.forEach((teacher) => {
      teacher.slots.forEach((slot) => {
        getDaysForSlot(slot).forEach((day) => {
          const key = `${day}-${slot}`;
          if (!slotOccupancyMap.has(key)) {
            slotOccupancyMap.set(key, []);
          }
          slotOccupancyMap.get(key)!.push({ teacher, day });
        });
      });
    });

    // Pre-calculate clash details for each (day, slot) combination
    const precomputedClashDetails: Record<
      string,
      { courses: string[] } | null
    > = {};
    for (const day of days) {
      for (const timePeriodSlots of timetableData[day]) {
        for (const currentSlot of timePeriodSlots) {
          const cellKey = `${day}-${currentSlot}`;
          const currentSlotTeachers = slotOccupancyMap.get(cellKey) || [];

          if (currentSlotTeachers.length > 1) {
            const clashingCourseCodes: string[] = [];
            const processedTeacherIds = new Set<string>();

            // Collect all unique course codes involved in a clash for this specific slot-day
            for (const { teacher } of currentSlotTeachers) {
              if (!processedTeacherIds.has(teacher.id)) {
                const courseCode =
                  courseCodeMap.get(teacher.course) || "Unknown";
                clashingCourseCodes.push(`${courseCode} (${teacher.name})`);
                processedTeacherIds.add(teacher.id);
              }
            }
            // Sort and remove duplicates
            const uniqueClashingCourses = [
              ...new Set(clashingCourseCodes),
            ].sort();
            precomputedClashDetails[cellKey] = {
              courses: uniqueClashingCourses,
            };
          } else if (currentSlotTeachers.length === 1) {
            // Check for cross-slot/cross-teacher clashes even if only one teacher occupies the direct slot
            const mainTeacher = currentSlotTeachers[0].teacher;
            let hasExternalClash = false;
            const externalClashingCourseCodes: string[] = [];
            const externalProcessedTeacherIds = new Set<string>();

            for (const mainTeacherSlot of mainTeacher.slots) {
              for (const otherSelectedTeacher of selectedTeachers) {
                if (mainTeacher.id === otherSelectedTeacher.id) continue;

                for (const otherTeacherSlot of otherSelectedTeacher.slots) {
                  const otherTeacherDays = getDaysForSlot(otherTeacherSlot);
                  if (
                    otherTeacherDays.includes(day) &&
                    doSlotsClash(day, mainTeacherSlot, day, otherTeacherSlot)
                  ) {
                    hasExternalClash = true;
                    if (
                      !externalProcessedTeacherIds.has(otherSelectedTeacher.id)
                    ) {
                      const otherCourseCode =
                        courseCodeMap.get(otherSelectedTeacher.course) ||
                        "Unknown";
                      externalClashingCourseCodes.push(
                        `${otherCourseCode} (${otherSelectedTeacher.name})`,
                      );
                      externalProcessedTeacherIds.add(otherSelectedTeacher.id);
                    }
                  }
                }
              }
            }
            if (hasExternalClash) {
              const mainCourseCode =
                courseCodeMap.get(mainTeacher.course) || "Unknown";
              externalClashingCourseCodes.unshift(
                `${mainCourseCode} (${mainTeacher.name})`,
              ); // Add main teacher's info first
              const uniqueExternalClashingCourses = [
                ...new Set(externalClashingCourseCodes),
              ].sort();
              precomputedClashDetails[cellKey] = {
                courses: uniqueExternalClashingCourses,
              };
            }
          }
        }
      }
    }

    // Fill `cellsData` for all timetable slots
    for (const day of days) {
      cells[day] = {};
      for (const timePeriodSlots of timetableData[day]) {
        // A timetable cell can contain multiple concurrent slots (e.g., ["L1", "L2"])
        const slotKey = timePeriodSlots.join("/"); // Create a unique key for the cell (e.g., "A1/L1")

        // Find the selected teacher(s) associated with any of these slots on this specific day
        const teachersInThisCell: Teacher[] = [];
        const processedTeacherIdsForCell = new Set<string>();

        for (const slotName of timePeriodSlots) {
          const currentSlotTeachers =
            slotOccupancyMap.get(`${day}-${slotName}`) || [];
          for (const { teacher } of currentSlotTeachers) {
            if (!processedTeacherIdsForCell.has(teacher.id)) {
              teachersInThisCell.push(teacher);
              processedTeacherIdsForCell.add(teacher.id);
            }
          }
        }

        let teacherName = "";
        let courseCode = "";
        let venue = "";
        let color = "";
        let isClash = false;
        let clashDetail: { courses: string[] } | null = null;

        if (teachersInThisCell.length > 0) {
          // If there are multiple teachers in this cell, it's a direct slot clash for this cell
          // Or if there's one teacher, but their slot clashes with another selected teacher's slot elsewhere.
          isClash =
            precomputedClashDetails[`${day}-${timePeriodSlots[0]}`] !==
            undefined; // Check if any part of this cell has a clash
          clashDetail =
            precomputedClashDetails[`${day}-${timePeriodSlots[0]}`] || null;

          // For display, use the info of the first teacher in the cell (or any if there's a clash)
          const displayTeacher = teachersInThisCell[0]; // Or a more sophisticated choice if needed
          teacherName = displayTeacher.name;
          courseCode = courseCodeMap.get(displayTeacher.course) || "";
          venue = displayTeacher.venue || "";
          color = `bg-${displayTeacher.color}-ui text-${displayTeacher.color}-dim`;
        } else {
          // No selected teachers in this cell
          color =
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800";
        }

        // Check if any individual slot within this cell is manually selected
        const isSelectedManual = timePeriodSlots.some((s) =>
          manualSelectedSlots.includes(s),
        );

        cells[day][slotKey] = {
          color,
          teacherName,
          courseCode,
          venue,
          isClash: isClash || clashDetail !== null, // A cell is clashing if it has any precomputed clash detail
          clashDetails: clashDetail,
          isSelectedManual,
        };
      }
    }

    return cells;
  }, [selectedTeachers, courses, manualSelectedSlots, allClashes]); // Recompute when selectedTeachers, courses, or manualSelectedSlots change

  return {
    cellsData,
    totalCredits,
    allClashesCount,
    manualSelectedSlots,
  };
}
