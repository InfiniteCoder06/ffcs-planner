"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { timetableData, getManualClashingSlot } from "./slots";

// Optimized clash detection with caching
const slotTimeCache = new Map<string, string[]>();
const clashResultCache = new Map<string, boolean>();

// Generate cache key for clash pair
const getClashCacheKey = (slot1: string, slot2: string): string => {
  return [slot1, slot2].sort().join("|");
};

const getSlotsAtSameTime = (targetSlot: string): string[] => {
  // Check cache first
  if (slotTimeCache.has(targetSlot)) {
    return slotTimeCache.get(targetSlot)!;
  }

  const slotsAtSameTime: string[] = [];

  // Check each day and time slot
  Object.values(timetableData).forEach((daySchedule) => {
    daySchedule.forEach((timeSlots) => {
      if (timeSlots.includes(targetSlot)) {
        // Add all slots from this time period
        slotsAtSameTime.push(...timeSlots.filter((slot) => slot !== ""));
      }
    });
  });

  const result = [...new Set(slotsAtSameTime)]; // Remove duplicates
  slotTimeCache.set(targetSlot, result); // Cache the result
  return result;
};

// Enhanced optimized clash detection with caching
const doSlotsClash = (slot1: string, slot2: string): boolean => {
  if (slot1 === slot2) return true;

  // Check cache first
  const cacheKey = getClashCacheKey(slot1, slot2);
  if (clashResultCache.has(cacheKey)) {
    return clashResultCache.get(cacheKey)!;
  }

  let result = false;

  // Check for manual clashes first (most efficient)
  const manualClash = getManualClashingSlot(slot1);
  if (manualClash === slot2) {
    result = true;
  } else {
    // Check reverse manual clash
    const reverseManualClash = getManualClashingSlot(slot2);
    if (reverseManualClash === slot1) {
      result = true;
    } else {
      // Check if both are lab slots - labs in same time slot don't clash with each other
      const slot1IsLab = slot1.startsWith("L");
      const slot2IsLab = slot2.startsWith("L");

      if (slot1IsLab && slot2IsLab) {
        // Lab slots don't clash with other lab slots in the same time period
        result = false;
      } else {
        // Check for same time slot clashes (theory with theory, or theory with lab)
        const slot1Times = getSlotsAtSameTime(slot1);
        result = slot1Times.includes(slot2);
      }
    }
  }

  // Cache the result
  clashResultCache.set(cacheKey, result);
  return result;
};

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface Teacher {
  id: string;
  name: string;
  color: string;
  slots: string[];
  venue: string;
  course: string;
}

export interface ExportData {
  courses: Course[];
  teachers: Teacher[];
  selectedTeachers: Teacher[];
  selectedSlots: string[];
}

export interface ClashInfo {
  slot: string;
  teacher1: Teacher;
  teacher2: Teacher;
}

type State = {
  courses: Course[];
  teachers: Teacher[];
  selectedTeachers: Teacher[];
  selectedSlots: string[];
};

type Actions = {
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id">) => void;
  editCourse: (id: string, course: Partial<Omit<Course, "id">>) => void;
  removeCourse: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  editTeacher: (id: string, teacher: Partial<Omit<Teacher, "id">>) => void;
  removeTeacher: (id: string) => void;

  clearSelectedTeachers: () => void;
  clearAll: () => void;

  toggleTeacherInTimetable: (teacherId: string) => void;
  isTeacherSelected: (teacherId: string) => boolean;

  teacherSlotClash: (teacherId: string) => Teacher[];
  getTeachersClash: (slots: string[]) => Teacher[];

  getSlotClashes: (slot: string) => ClashInfo[];
  getAllClashes: () => ClashInfo[];

  getExportData: () => {
    courses: Course[];
    teachers: Teacher[];
    selectedTeachers: Teacher[];
    selectedSlots: string[];
  };
  setExportData: (data: {
    courses: Course[];
    teachers: Teacher[];
    selectedTeachers: Teacher[];
    selectedSlots: string[];
  }) => void;

  clearClashCaches: () => void; // Add clearClashCaches to Actions type
};

export const useScheduleStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      courses: [],
      teachers: [],
      selectedTeachers: [],
      selectedSlots: [],

      getCourse: (id) => get().courses.find((c) => c.id === id),

      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, { ...course, id: crypto.randomUUID() }],
        })),

      editCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      removeCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          teachers: state.teachers.filter((t) => t.course !== id),
          selectedTeachers: state.selectedTeachers.filter(
            (t) => t.course !== id,
          ),
        })),

      addTeacher: (teacher) =>
        set((state) => ({
          teachers: [
            ...state.teachers,
            { ...teacher, id: Math.random().toString(36).slice(2, 9) },
          ],
        })),

      editTeacher: (id, updates) =>
        set((state) => {
          const updateFn = (t: Teacher) =>
            t.id === id ? { ...t, ...updates } : t;

          return {
            teachers: state.teachers.map(updateFn),
            selectedTeachers: state.selectedTeachers.map(updateFn),
          };
        }),

      removeTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
          selectedTeachers: state.selectedTeachers.filter((t) => t.id !== id),
        })),

      clearSelectedTeachers: () =>
        set({ selectedTeachers: [], selectedSlots: [] }),

      clearAll: () =>
        set({
          courses: [],
          teachers: [],
          selectedTeachers: [],
          selectedSlots: [],
        }),

      toggleTeacherInTimetable: (teacherId) =>
        set((state) => {
          const teacher = state.teachers.find((t) => t.id === teacherId);
          if (!teacher) return state;

          const isSelected = state.selectedTeachers.some(
            (t) => t.id === teacherId,
          );

          if (isSelected) {
            const newSelectedTeachers = state.selectedTeachers.filter(
              (t) => t.id !== teacherId,
            );
            const newSelectedSlots = state.selectedSlots.filter(
              (slot) => !teacher.slots.includes(slot),
            );

            return {
              selectedTeachers: newSelectedTeachers,
              selectedSlots: newSelectedSlots,
            };
          }

          return {
            selectedTeachers: [...state.selectedTeachers, teacher],
            selectedSlots: Array.from(
              new Set([...state.selectedSlots, ...teacher.slots]),
            ),
          };
        }),

      isTeacherSelected: (teacherId) =>
        get().selectedTeachers.some((t) => t.id === teacherId),

      teacherSlotClash: (teacherId) => {
        const teacher = get().teachers.find((t) => t.id === teacherId);
        if (!teacher) return [];

        const clashes = new Map<string, Teacher>();
        const selected = get().selectedTeachers.filter(
          (t) => t.id !== teacherId,
        );

        // Pre-compute clashing slots for the teacher
        const teacherClashMap = new Map<string, string[]>();
        for (const slot of teacher.slots) {
          const clashingSlots: string[] = [];
          for (const t of selected) {
            clashingSlots.push(
              ...t.slots.filter((tSlot) => doSlotsClash(slot, tSlot)),
            );
          }
          if (clashingSlots.length > 0) {
            teacherClashMap.set(slot, clashingSlots);
          }
        }

        // Build clash results
        for (const t of selected) {
          const allClashingSlots = new Set<string>();

          for (const [, clashingSlots] of teacherClashMap) {
            for (const clashSlot of clashingSlots) {
              if (t.slots.includes(clashSlot)) {
                allClashingSlots.add(clashSlot);
              }
            }
          }

          if (allClashingSlots.size > 0) {
            clashes.set(t.id, { ...t, slots: Array.from(allClashingSlots) });
          }
        }

        return Array.from(clashes.values());
      },

      getTeachersClash: (slots) => {
        return get().teachers.filter((teacher) =>
          teacher.slots.some((teacherSlot) => {
            return slots.some((slot) => doSlotsClash(slot, teacherSlot));
          }),
        );
      },

      getExportData: () => {
        const { courses, teachers, selectedTeachers, selectedSlots } = get();
        return { courses, teachers, selectedTeachers, selectedSlots };
      },

      setExportData: (data) => {
        const { courses, teachers, selectedTeachers, selectedSlots } = data;

        set({
          courses,
          teachers,
          selectedTeachers,
          selectedSlots,
        });
      },

      getSlotClashes: (slot) => {
        const { selectedTeachers } = get();
        const clashes: ClashInfo[] = [];

        // Find all teachers that have slots that clash with the target slot
        const teachersWithConflictingSlots = selectedTeachers.filter(
          (teacher) =>
            teacher.slots.some((teacherSlot) =>
              doSlotsClash(slot, teacherSlot),
            ),
        );

        // If less than 2 teachers have conflicting slots, there's no clash
        if (teachersWithConflictingSlots.length < 2) return [];

        // Create clash pairs
        for (let i = 0; i < teachersWithConflictingSlots.length; i++) {
          for (let j = i + 1; j < teachersWithConflictingSlots.length; j++) {
            clashes.push({
              slot,
              teacher1: teachersWithConflictingSlots[i],
              teacher2: teachersWithConflictingSlots[j],
            });
          }
        }

        return clashes;
      },

      // Get all clashes in the timetable
      getAllClashes: () => {
        const { selectedTeachers } = get();
        const clashes: ClashInfo[] = [];
        const processedClashes = new Set<string>();

        // Check each teacher's slots against every other teacher's slots
        for (let i = 0; i < selectedTeachers.length; i++) {
          for (let j = i + 1; j < selectedTeachers.length; j++) {
            const teacher1 = selectedTeachers[i];
            const teacher2 = selectedTeachers[j];

            // Check each slot of teacher1 against each slot of teacher2
            for (const slot1 of teacher1.slots) {
              for (const slot2 of teacher2.slots) {
                if (doSlotsClash(slot1, slot2)) {
                  // Create a unique identifier for this clash to avoid duplicates
                  const clashId = [teacher1.id, teacher2.id, slot1, slot2]
                    .sort()
                    .join("-");
                  if (!processedClashes.has(clashId)) {
                    processedClashes.add(clashId);
                    clashes.push({
                      slot: slot1, // Use the first slot as reference
                      teacher1,
                      teacher2,
                    });
                  }
                }
              }
            }
          }
        }

        return clashes;
      },

      // Cache management functions
      clearClashCaches: () => {
        slotTimeCache.clear();
        clashResultCache.clear();
      },
    }),
    {
      name: "schedule-store",
      partialize: (state) => ({
        courses: state.courses,
        teachers: state.teachers,
        selectedTeachers: state.selectedTeachers,
        selectedSlots: state.selectedSlots,
      }),
    },
  ),
);

export const manualSlotSelectionStore = create<{
  manualSelectedSlots: string[];
  clearSelectedSlots: () => void;
  selectSlot: (slot: string) => void;
  deselectSlot: (slot: string) => void;
  toggleSlot: (slot: string) => void;
}>((set) => ({
  manualSelectedSlots: [],
  clearSelectedSlots: () => set({ manualSelectedSlots: [] }),
  selectSlot: (slot) =>
    set((state) => ({
      manualSelectedSlots: [...state.manualSelectedSlots, slot],
    })),
  deselectSlot: (slot) =>
    set((state) => ({
      manualSelectedSlots: state.manualSelectedSlots.filter((s) => s !== slot),
    })),
  toggleSlot: (slot) =>
    set((state) => {
      const isSelected = state.manualSelectedSlots.includes(slot);
      return {
        manualSelectedSlots: isSelected
          ? state.manualSelectedSlots.filter((s) => s !== slot)
          : [...state.manualSelectedSlots, slot],
      };
    }),
}));
