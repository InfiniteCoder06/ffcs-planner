"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearClashDetectionCaches,
  doSlotsClash,
  getDaysForSlot,
} from "./clash-detection";

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

  clearClashCaches: () => void;
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

          clearClashDetectionCaches();

          return {
            teachers: state.teachers.map(updateFn),
            selectedTeachers: state.selectedTeachers.map(updateFn),
          };
        }),

      removeTeacher: (id) =>
        set((state) => {
          clearClashDetectionCaches();

          return {
            teachers: state.teachers.filter((t) => t.id !== id),
            selectedTeachers: state.selectedTeachers.filter((t) => t.id !== id),
          };
        }),

      clearSelectedTeachers: () => {
        set({ selectedTeachers: [], selectedSlots: [] });
        clearClashDetectionCaches();
      },

      clearAll: () => {
        set({
          courses: [],
          teachers: [],
          selectedTeachers: [],
          selectedSlots: [],
        });
        clearClashDetectionCaches();
      },

      toggleTeacherInTimetable: (teacherId) =>
        set((state) => {
          const teacher = state.teachers.find((t) => t.id === teacherId);
          if (!teacher) return state;

          const isSelected = state.selectedTeachers.some(
            (t) => t.id === teacherId,
          );

          clearClashDetectionCaches();

          if (isSelected) {
            const newSelectedTeachers = state.selectedTeachers.filter(
              (t) => t.id !== teacherId,
            );
            const newSelectedSlots = Array.from(
              new Set(newSelectedTeachers.flatMap((t) => t.slots)),
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
        const teacherToConsider = get().teachers.find(
          (t) => t.id === teacherId,
        );
        if (!teacherToConsider) return [];

        const clashes: Teacher[] = [];
        const processedClashingTeacherIds = new Set<string>();

        // Get currently selected teachers, excluding the one being considered if it's already selected
        const currentlySelectedTeachers = get().selectedTeachers.filter(
          (t) => t.id !== teacherId,
        );

        // Iterate through each slot of the teacher being considered
        for (const slotOfTeacherToConsider of teacherToConsider.slots) {
          const daysForSlotOfTeacherToConsider = getDaysForSlot(
            slotOfTeacherToConsider,
          );

          // For each day this slot occurs
          for (const day of daysForSlotOfTeacherToConsider) {
            // Check against every other selected teacher
            for (const otherSelectedTeacher of currentlySelectedTeachers) {
              // If this other selected teacher has already been identified as clashing, skip
              if (processedClashingTeacherIds.has(otherSelectedTeacher.id))
                continue;

              // Check each slot of the other selected teacher
              for (const slotOfOtherTeacher of otherSelectedTeacher.slots) {
                // If the other teacher's slot also occurs on this day
                if (getDaysForSlot(slotOfOtherTeacher).includes(day)) {
                  if (
                    doSlotsClash(
                      day,
                      slotOfTeacherToConsider,
                      day,
                      slotOfOtherTeacher,
                    )
                  ) {
                    // Found a clash! Add the other selected teacher to the list
                    clashes.push(otherSelectedTeacher);
                    processedClashingTeacherIds.add(otherSelectedTeacher.id);
                    break; // Move to the next `otherSelectedTeacher`
                  }
                }
              }
              if (processedClashingTeacherIds.has(otherSelectedTeacher.id))
                break; // Move to next `otherSelectedTeacher`
            }
          }
        }
        return clashes;
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

      getSlotClashes: (targetSlot: string) => {
        const { selectedTeachers } = get();
        const clashes: ClashInfo[] = [];
        const processedClashPairs = new Set<string>(); // To avoid duplicate teacher pairs for a slot

        const targetSlotDays = getDaysForSlot(targetSlot);

        if (targetSlotDays.length === 0) return [];

        // Find all teachers that have slots that clash with the target slot on the same day
        for (const day of targetSlotDays) {
          const teachersOnThisDay = selectedTeachers.filter((t) =>
            t.slots.some((s) => getDaysForSlot(s).includes(day)),
          );

          // Filter teachers that actually clash with targetSlot on this specific day
          const clashingTeachersWithTargetSlot = teachersOnThisDay.filter(
            (teacher) =>
              teacher.slots.some((teacherSlot) =>
                doSlotsClash(day, targetSlot, day, teacherSlot),
              ),
          );

          // If less than 2 teachers (including the one for targetSlot) have conflicting slots, there's no clash for this day
          if (clashingTeachersWithTargetSlot.length < 2) continue;

          // Create clash pairs
          for (let i = 0; i < clashingTeachersWithTargetSlot.length; i++) {
            for (
              let j = i + 1;
              j < clashingTeachersWithTargetSlot.length;
              j++
            ) {
              const teacher1 = clashingTeachersWithTargetSlot[i];
              const teacher2 = clashingTeachersWithTargetSlot[j];

              // Ensure that at least one of the teachers involved in the pair has the targetSlot
              // or that their slots clash with the targetSlot
              const isRelevantClash =
                (teacher1.slots.includes(targetSlot) &&
                  teacher2.slots.some((s) =>
                    doSlotsClash(day, targetSlot, day, s),
                  )) ||
                (teacher2.slots.includes(targetSlot) &&
                  teacher1.slots.some((s) =>
                    doSlotsClash(day, targetSlot, day, s),
                  ));

              if (isRelevantClash) {
                const clashPairId = [teacher1.id, teacher2.id].sort().join("-");
                if (!processedClashPairs.has(clashPairId)) {
                  processedClashPairs.add(clashPairId);
                  clashes.push({
                    slot: targetSlot,
                    teacher1: teacher1,
                    teacher2: teacher2,
                  });
                }
              }
            }
          }
        }
        return clashes;
      },

      getAllClashes: () => {
        const { selectedTeachers } = get();
        const clashes: ClashInfo[] = [];
        const processedClashes = new Set<string>(); // To avoid duplicate clash entries (teacher1-teacher2-slot-day)

        // Iterate through all possible pairs of selected teachers
        for (let i = 0; i < selectedTeachers.length; i++) {
          for (let j = i + 1; j < selectedTeachers.length; j++) {
            const teacher1 = selectedTeachers[i];
            const teacher2 = selectedTeachers[j];

            // Check for clashes between their slots across all days
            for (const slot1 of teacher1.slots) {
              for (const slot2 of teacher2.slots) {
                // Get days for both slots
                const daysForSlot1 = getDaysForSlot(slot1);
                const daysForSlot2 = getDaysForSlot(slot2);

                // Find common days where both slots occur
                const commonDays = daysForSlot1.filter((day) =>
                  daysForSlot2.includes(day),
                );

                for (const day of commonDays) {
                  if (doSlotsClash(day, slot1, day, slot2)) {
                    const clashId = [
                      teacher1.id,
                      teacher2.id,
                      slot1,
                      slot2,
                      day,
                    ]
                      .sort()
                      .join("-");
                    if (!processedClashes.has(clashId)) {
                      processedClashes.add(clashId);
                      clashes.push({
                        slot: slot1,
                        teacher1,
                        teacher2,
                      });
                    }
                  }
                }
              }
            }
          }
        }
        return clashes;
      },

      clearClashCaches: () => {
        clearClashDetectionCaches();
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
