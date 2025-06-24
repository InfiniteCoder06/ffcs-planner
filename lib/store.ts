"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { timetableData } from "./slots";

// Helper function to get all slots that occur at the same time
const getSlotsAtSameTime = (targetSlot: string): string[] => {
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

  return [...new Set(slotsAtSameTime)]; // Remove duplicates
};

// Helper function to check if two slots clash (occur at same time)
// const doSlotsClash = (slot1: string, slot2: string): boolean => {
//   if (slot1 === slot2) return true;

//   const slot1Times = getSlotsAtSameTime(slot1);
//   return slot1Times.includes(slot2);
// };

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

        const clashes: Record<string, Teacher> = {};
        const selected = get().selectedTeachers.filter(
          (t) => t.id !== teacherId,
        );

        for (const slot of teacher.slots) {
          const slotsAtSameTime = getSlotsAtSameTime(slot);
          for (const t of selected) {
            const hasClash = t.slots.some((tSlot) =>
              slotsAtSameTime.includes(tSlot),
            );
            if (hasClash) {
              const clashingSlots = t.slots.filter((tSlot) =>
                slotsAtSameTime.includes(tSlot),
              );
              if (!clashes[t.id]) {
                clashes[t.id] = { ...t, slots: clashingSlots };
              } else {
                clashingSlots.forEach((clashSlot) => {
                  if (!clashes[t.id].slots.includes(clashSlot)) {
                    clashes[t.id].slots.push(clashSlot);
                  }
                });
              }
            }
          }
        }

        return Object.values(clashes);
      },

      getTeachersClash: (slots) => {
        return get().teachers.filter((teacher) =>
          teacher.slots.some((teacherSlot) => {
            return slots.some((slot) => {
              const slotsAtSameTime = getSlotsAtSameTime(slot);
              return slotsAtSameTime.includes(teacherSlot);
            });
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
        const slotsAtSameTime = getSlotsAtSameTime(slot);

        // Find all teachers that have slots occurring at the same time as the target slot
        const teachersWithConflictingSlots = selectedTeachers.filter(
          (teacher) =>
            teacher.slots.some((teacherSlot) =>
              slotsAtSameTime.includes(teacherSlot),
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
        const processedSlotPairs = new Set<string>();

        // Check each teacher's slots against every other teacher's slots
        for (let i = 0; i < selectedTeachers.length; i++) {
          for (let j = i + 1; j < selectedTeachers.length; j++) {
            const teacher1 = selectedTeachers[i];
            const teacher2 = selectedTeachers[j];

            // Check each slot of teacher1 against each slot of teacher2
            for (const slot1 of teacher1.slots) {
              const slotsAtSameTime = getSlotsAtSameTime(slot1);

              for (const slot2 of teacher2.slots) {
                if (slotsAtSameTime.includes(slot2)) {
                  // Create a unique identifier for this slot pair to avoid duplicates
                  const pairId = [slot1, slot2].sort().join("-");
                  if (!processedSlotPairs.has(pairId)) {
                    processedSlotPairs.add(pairId);
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
  selectedSlots: string[];
  clearSelectedSlots: () => void;
  selectSlot: (slot: string) => void;
  deselectSlot: (slot: string) => void;
  toggleSlot: (slot: string) => void;
}>((set) => ({
  selectedSlots: [],
  clearSelectedSlots: () => set({ selectedSlots: [] }),
  selectSlot: (slot) =>
    set((state) => ({
      selectedSlots: [...state.selectedSlots, slot],
    })),
  deselectSlot: (slot) =>
    set((state) => ({
      selectedSlots: state.selectedSlots.filter((s) => s !== slot),
    })),
  toggleSlot: (slot) =>
    set((state) => {
      const isSelected = state.selectedSlots.includes(slot);
      return {
        selectedSlots: isSelected
          ? state.selectedSlots.filter((s) => s !== slot)
          : [...state.selectedSlots, slot],
      };
    }),
}));
