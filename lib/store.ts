"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_COURSES, DEFAULT_TEACHERS } from "./fakeData";

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
};

export const useScheduleStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      courses: DEFAULT_COURSES,
      teachers: DEFAULT_TEACHERS,
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
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          teachers: state.teachers.filter((t) => t.course !== id),
          selectedTeachers: state.selectedTeachers.filter(
            (t) => t.course !== id
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

      clearSelectedTeachers: () => set({ selectedTeachers: [], selectedSlots: [] }),

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
            (t) => t.id === teacherId
          );

          if (isSelected) {
            return {
              selectedTeachers: state.selectedTeachers.filter(
                (t) => t.id !== teacherId
              ),
              selectedSlots: state.selectedSlots.filter(
                (slot) => !teacher.slots.includes(slot)
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
        const selected = get().selectedTeachers.filter((t) => t.id !== teacherId);

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
          t.slots.some((slot) => slots.includes(slot))
        ),
    }),
    {
      name: "schedule-store",
    }
  )
);
