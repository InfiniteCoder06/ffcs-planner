"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
          courses: [
            ...state.courses,
            { ...course, id: Math.random().toString(36).slice(2, 9) },
          ],
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
          if (!teacher) return {};

          const isSelected = state.selectedTeachers.some(
            (t) => t.id === teacherId,
          );

          if (isSelected) {
            return {
              selectedTeachers: state.selectedTeachers.filter(
                (t) => t.id !== teacherId,
              ),
              selectedSlots: state.selectedSlots.filter(
                (slot) => !teacher.slots.includes(slot),
              ),
            };
          }

          return {
            selectedTeachers: [...state.selectedTeachers, teacher],
            selectedSlots: [...state.selectedSlots, ...teacher.slots],
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
          for (const t of selected) {
            if (t.slots.includes(slot)) {
              if (!clashes[t.id]) {
                clashes[t.id] = { ...t, slots: [slot] };
              } else if (!clashes[t.id].slots.includes(slot)) {
                clashes[t.id].slots.push(slot);
              }
            }
          }
        }

        return Object.values(clashes);
      },

      getTeachersClash: (slots) =>
        get().teachers.filter((t) =>
          t.slots.some((slot) => slots.includes(slot)),
        ),

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

        // Find all teachers that have this slot
        const teachersWithSlot = selectedTeachers.filter((teacher) =>
          teacher.slots.includes(slot),
        );

        // If less than 2 teachers have this slot, there's no clash
        if (teachersWithSlot.length < 2) return [];

        // Create clash pairs
        for (let i = 0; i < teachersWithSlot.length; i++) {
          for (let j = i + 1; j < teachersWithSlot.length; j++) {
            clashes.push({
              slot,
              teacher1: teachersWithSlot[i],
              teacher2: teachersWithSlot[j],
            });
          }
        }

        return clashes;
      },

      // Get all clashes in the timetable
      getAllClashes: () => {
        const { selectedTeachers } = get();
        const clashes: ClashInfo[] = [];

        // Create a map of slots to teachers
        const slotMap: Record<string, Teacher[]> = {};

        // Populate the map
        selectedTeachers.forEach((teacher) => {
          teacher.slots.forEach((slot) => {
            if (!slotMap[slot]) {
              slotMap[slot] = [];
            }
            slotMap[slot].push(teacher);
          });
        });

        // Check each slot for clashes
        Object.entries(slotMap).forEach(([slot, teachers]) => {
          if (teachers.length >= 2) {
            // Create clash pairs
            for (let i = 0; i < teachers.length; i++) {
              for (let j = i + 1; j < teachers.length; j++) {
                clashes.push({
                  slot,
                  teacher1: teachers[i],
                  teacher2: teachers[j],
                });
              }
            }
          }
        });

        return clashes;
      },
    }),
    {
      name: "schedule-store",
    },
  ),
);
