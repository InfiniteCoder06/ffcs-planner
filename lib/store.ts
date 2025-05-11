"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  getTeachersClash: (slot: string[]) => Teacher[];
};

export const useScheduleStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      courses: DEFAULT_COURSES,
      teachers: DEFAULT_TEACHERS,
      selectedTeachers: [],
      selectedSlots: [],

      getCourse: (id) => get().courses.find((course) => course.id === id),

      addCourse: (course) =>
        set((state) => ({
          courses: [
            ...state.courses,
            { ...course, id: Math.random().toString(36).substring(2, 9) },
          ],
        })),

      editCourse: (id, updatedCourse) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id ? { ...course, ...updatedCourse } : course,
          ),
        })),

      addTeacher: (teacher) =>
        set((state) => {
          const newTeacher = {
            ...teacher,
            id: Math.random().toString(36).substring(2, 9),
          };
          return {
            teachers: [...state.teachers, newTeacher],
          };
        }),

      editTeacher: (id, updatedTeacher) =>
        set((state) => ({
          teachers: state.teachers.map((teacher) =>
            teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher,
          ),
          selectedTeachers: state.selectedTeachers.map((teacher) =>
            teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher,
          ),
        })),

      clearSelectedTeachers: () => set({ selectedTeachers: [] }),

      clearAll: () =>
        set({
          selectedTeachers: [],
          courses: [],
          teachers: [],
        }),

      removeCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
          teachers: state.teachers.filter((teacher) => teacher.course !== id),
          selectedTeachers: state.selectedTeachers.filter(
            (course) => course.course !== id,
          ),
        })),

      removeTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((teacher) => teacher.id !== id),
          selectedTeachers: state.selectedTeachers.filter(
            (teacher) => teacher.id !== id,
          ),
        })),

      toggleTeacherInTimetable: (teacherId) =>
        set((state) => {
          const teacher = state.teachers.find((t) => t.id === teacherId);
          if (!teacher) return state;

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
          } else {
            return {
              selectedTeachers: [...state.selectedTeachers, teacher],
              selectedSlots: [...state.selectedSlots, ...teacher.slots],
            };
          }
        }),

      isTeacherSelected: (teacherId) =>
        get().selectedTeachers.some((t) => t.id === teacherId),

      teacherSlotClash: (teacherId) => {
        const teacher = get().teachers.find((t) => t.id === teacherId);
        if (!teacher) return [];

        const selectedTeachers = get().selectedTeachers.filter(
          (t) => t.id !== teacherId,
        );
        const clashingDetails: Teacher[] = [];

        teacher.slots.forEach((slot) => {
          selectedTeachers.forEach((selectedTeacher) => {
            if (selectedTeacher.slots.includes(slot)) {
              let teacherEntry = clashingDetails.find(
                (t) => t.id === selectedTeacher.id,
              );
              if (!teacherEntry) {
                teacherEntry = selectedTeacher;
                clashingDetails.push(teacherEntry);
              }
              if (!teacherEntry.slots.includes(slot)) {
                teacherEntry.slots.push(slot);
              }
            }
          });
        });

        return clashingDetails;
      },

      getTeachersClash: (slots) =>
        get().teachers.filter((teacher) =>
          teacher.slots.some((slot) => slots.includes(slot)),
        ),
    }),
    {
      name: "schedule-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
