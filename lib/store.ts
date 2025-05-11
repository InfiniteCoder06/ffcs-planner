"use client";

import { create } from "zustand";

// Add fake data constants
const DEFAULT_COURSES = [
  {
    id: "c1",
    name: "Structured and Object-Oriented Programming",
    code: "BCSE101P",
    credits: 2,
  },
  { id: "c2", name: "Differential Equations", code: "BMAT102P", credits: 4 },
  { id: "c3", name: "Engineering Physics", code: "BPHY101P", credits: 2 },
  { id: "c4", name: "Quantitative Skills", code: "BSTS101P", credits: 1 },
  {
    id: "c5",
    name: "Technical English Communication",
    code: "BENG101P",
    credits: 2,
  },
  { id: "c6", name: "Web Development", code: "BCSE102P", credits: 3 },
  {
    id: "c7",
    name: "Structured and Object-Oriented Programming Lab",
    code: "BCSE101L",
    credits: 2,
  },
  { id: "c8", name: "Engineering Physics Lab", code: "BPHY101L", credits: 1 },
  {
    id: "c9",
    name: "Technical English Communication Lab",
    code: "BENG101L",
    credits: 1,
  },
];

const DEFAULT_TEACHERS = [
  {
    id: "t1",
    name: "Vinila Jinny",
    color: "cyan",
    slots: ["B2"],
    venue: "PRP 105",
    course: "c1",
  },
  {
    id: "t2",
    name: "Vinila Jinny",
    color: "cyan",
    slots: ["L5", "L6", "L27", "L28"],
    venue: "PRP 118",
    course: "c7",
  },
  {
    id: "t3",
    name: "MurugusundaraMoorthy",
    color: "fuchsia",
    slots: ["C2", "TC2", "TCC2"],
    venue: "PRP 109",
    course: "c2",
  },
  {
    id: "t4",
    name: "Samuel P",
    color: "indigo",
    slots: ["E2", "TE2"],
    venue: "PRP 116",
    course: "c3",
  },
  {
    id: "t5",
    name: "Samuel P",
    color: "indigo",
    slots: ["L3", "L5"],
    venue: "PRP 116",
    course: "c8",
  },
  {
    id: "t6",
    name: "Sakshi",
    color: "lime",
    slots: ["F2", "TF2"],
    venue: "PRP 116",
    course: "c4",
  },
  {
    id: "t7",
    name: "Mary Jennifier",
    color: "orange",
    slots: ["G2"],
    venue: "PRP 127",
    course: "c5",
  },
  {
    id: "t8",
    name: "Mary Jennifier",
    color: "orange",
    slots: ["L29", "L30"],
    venue: "PRP 127",
    course: "c9",
  },
  {
    id: "t9",
    name: "Justin Gopinath",
    color: "pink",
    slots: ["L23", "L24", "L25", "L26", "TG2"],
    venue: "PRP 236",
    course: "c6",
  },
  {
    id: "t10",
    name: "Jitendra Behera",
    color: "purple",
    slots: ["E2", "TE2"],
    venue: "PRP 116",
    course: "c3",
  },
  {
    id: "t11",
    name: "Jitendra Behera",
    color: "purple",
    slots: ["L3", "L4"],
    venue: "PRP 116",
    course: "c8",
  },
  {
    id: "t12",
    name: "John Doe",
    color: "teal",
    slots: ["G2"],
    venue: "PRP 127",
    course: "c2",
  },
];

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

export const useScheduleStore = create<State & Actions>((set, get) => ({
  // Initialize with fake data
  courses: DEFAULT_COURSES,
  teachers: DEFAULT_TEACHERS,
  // courses: [],
  // teachers: [],

  selectedTeachers: [],
  selectedSlots: [],

  getCourse: (id) => {
    return get().courses.find((course) => course.id === id);
  },

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
      // Also update the teacher in selectedTeachers if it's there
      selectedTeachers: state.selectedTeachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher,
      ),
    })),

  clearSelectedTeachers: () =>
    set({
      selectedTeachers: [],
    }),

  clearAll: () =>
    set({
      selectedTeachers: [],
      courses: [],
      teachers: [],
    }),

  removeCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
      // Also remove any teachers associated with this course
      teachers: state.teachers.filter((teacher) => teacher.course !== id),
      selectedTeachers: state.selectedTeachers.filter(
        (course) => course.course !== id,
      ),
    })),

  removeTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
      selectedTeachers: state.selectedTeachers.filter(
        (course) => course.id !== id,
      ),
    })),

  toggleTeacherInTimetable: (teacherId) =>
    set((state) => {
      const teacher = state.teachers.find((t) => t.id === teacherId);
      if (!teacher) return state;

      const isSelected = state.selectedTeachers.some((t) => t.id === teacherId);

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

  isTeacherSelected: (teacherId) => {
    return get().selectedTeachers.some((t) => t.id === teacherId);
  },

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
}));
