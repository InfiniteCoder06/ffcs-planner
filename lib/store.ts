"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearClashDetectionCaches,
  doSlotsClash,
  getDaysForSlot,
} from "./clash-detection";
import { Course, Teacher, ClashInfo, Timetable } from "@/types";

type State = {
  courses: Course[];
  teachers: Teacher[];
  timetables: Timetable[];
  activeTimetableId: string | null;
};

type Actions = {
  // Course actions
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id">) => void;
  editCourse: (id: string, course: Partial<Omit<Course, "id">>) => void;
  removeCourse: (id: string) => void;

  // Teacher actions
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  editTeacher: (id: string, teacher: Partial<Omit<Teacher, "id">>) => void;
  removeTeacher: (id: string) => void;
  deleteAllTeachersForCourse: (courseId: string) => void;

  // Timetable actions
  createTimetable: (name?: string) => string;
  deleteTimetable: (id: string) => void;
  renameTimetable: (id: string, name: string) => void;
  setActiveTimetable: (id: string) => void;
  duplicateTimetable: (id: string, newName?: string) => string;

  // Active timetable actions
  getActiveTimetable: () => Timetable | null;
  getSelectedTeachers: () => Teacher[];
  getSelectedSlots: () => string[];
  toggleTeacherInTimetable: (teacherId: string) => void;
  isTeacherSelected: (teacherId: string) => boolean;
  clearSelectedTeachers: () => void;

  // Clash detection
  teacherSlotClash: (teacherId: string) => Teacher[];
  hasSameSlotClashWithSelected: (teacherId: string) => boolean;
  getSlotClashes: (slot: string) => ClashInfo[];
  getAllClashes: () => ClashInfo[];

  // Import/Export
  getExportData: () => {
    courses: Course[];
    teachers: Teacher[];
    timetables: Timetable[];
    activeTimetableId: string | null;
  };
  setExportData: (data: {
    courses: Course[];
    teachers: Teacher[];
    selectedTeachers: Teacher[];
    selectedSlots: string[];
    timetables?: Timetable[];
    activeTimetableId?: string | null;
  }) => void;

  // Utility
  clearAll: () => void;
  clearClashCaches: () => void;
};

export const useScheduleStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      courses: [],
      teachers: [],
      timetables: [],
      activeTimetableId: null,

      // Course actions
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
        set((state) => {
          const newTimetables = state.timetables.map((timetable) => ({
            ...timetable,
            selectedTeachers: timetable.selectedTeachers.filter(
              (t) => t.course !== id,
            ),
            selectedSlots: Array.from(
              new Set(
                timetable.selectedTeachers
                  .filter((t) => t.course !== id)
                  .flatMap((t) => t.slots),
              ),
            ),
          }));

          return {
            courses: state.courses.filter((c) => c.id !== id),
            teachers: state.teachers.filter((t) => t.course !== id),
            timetables: newTimetables,
          };
        }),

      // Teacher actions
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

          const newTimetables = state.timetables.map((timetable) => ({
            ...timetable,
            selectedTeachers: timetable.selectedTeachers.map(updateFn),
          }));

          return {
            teachers: state.teachers.map(updateFn),
            timetables: newTimetables,
          };
        }),

      removeTeacher: (id) =>
        set((state) => {
          clearClashDetectionCaches();

          const newTimetables = state.timetables.map((timetable) => {
            const newSelectedTeachers = timetable.selectedTeachers.filter(
              (t) => t.id !== id,
            );
            return {
              ...timetable,
              selectedTeachers: newSelectedTeachers,
              selectedSlots: Array.from(
                new Set(newSelectedTeachers.flatMap((t) => t.slots)),
              ),
            };
          });

          return {
            teachers: state.teachers.filter((t) => t.id !== id),
            timetables: newTimetables,
          };
        }),

      deleteAllTeachersForCourse: (courseId) =>
        set((state) => {
          clearClashDetectionCaches();

          const newTimetables = state.timetables.map((timetable) => {
            const newSelectedTeachers = timetable.selectedTeachers.filter(
              (t) => t.course !== courseId,
            );
            return {
              ...timetable,
              selectedTeachers: newSelectedTeachers,
              selectedSlots: Array.from(
                new Set(newSelectedTeachers.flatMap((t) => t.slots)),
              ),
            };
          });

          return {
            teachers: state.teachers.filter((t) => t.course !== courseId),
            timetables: newTimetables,
          };
        }),

      // Timetable actions
      createTimetable: (name) => {
        const id = crypto.randomUUID();
        const currentTime = new Date();
        const timetableName =
          name || `Timetable ${get().timetables.length + 1}`;

        const newTimetable: Timetable = {
          id,
          name: timetableName,
          selectedTeachers: [],
          selectedSlots: [],
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        set((state) => ({
          timetables: [...state.timetables, newTimetable],
          activeTimetableId: id,
        }));

        return id;
      },

      deleteTimetable: (id) =>
        set((state) => {
          const newTimetables = state.timetables.filter((t) => t.id !== id);
          const newActiveTimetableId =
            state.activeTimetableId === id
              ? newTimetables.length > 0
                ? newTimetables[0].id
                : null
              : state.activeTimetableId;

          return {
            timetables: newTimetables,
            activeTimetableId: newActiveTimetableId,
          };
        }),

      renameTimetable: (id, name) =>
        set((state) => ({
          timetables: state.timetables.map((t) =>
            t.id === id ? { ...t, name, updatedAt: new Date() } : t,
          ),
        })),

      setActiveTimetable: (id) => set({ activeTimetableId: id }),

      duplicateTimetable: (id, newName) => {
        const state = get();
        const sourceTimetable = state.timetables.find((t) => t.id === id);
        if (!sourceTimetable) return "";

        const newId = crypto.randomUUID();
        const currentTime = new Date();
        const timetableName = newName || `${sourceTimetable.name} (Copy)`;

        const newTimetable: Timetable = {
          id: newId,
          name: timetableName,
          selectedTeachers: [...sourceTimetable.selectedTeachers],
          selectedSlots: [...sourceTimetable.selectedSlots],
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        set((state) => ({
          timetables: [...state.timetables, newTimetable],
          activeTimetableId: newId,
        }));

        return newId;
      },

      // Active timetable actions
      getActiveTimetable: () => {
        const state = get();
        return (
          state.timetables.find((t) => t.id === state.activeTimetableId) || null
        );
      },

      getSelectedTeachers: () => {
        const activeTimetable = get().getActiveTimetable();
        return activeTimetable?.selectedTeachers || [];
      },

      getSelectedSlots: () => {
        const activeTimetable = get().getActiveTimetable();
        return activeTimetable?.selectedSlots || [];
      },

      clearSelectedTeachers: () => {
        const state = get();
        if (!state.activeTimetableId) return;

        set((state) => ({
          timetables: state.timetables.map((t) =>
            t.id === state.activeTimetableId
              ? {
                  ...t,
                  selectedTeachers: [],
                  selectedSlots: [],
                  updatedAt: new Date(),
                }
              : t,
          ),
        }));

        clearClashDetectionCaches();
      },

      toggleTeacherInTimetable: (teacherId) => {
        const state = get();
        if (!state.activeTimetableId) return;

        const teacher = state.teachers.find((t) => t.id === teacherId);
        if (!teacher) return;

        const activeTimetable = state.getActiveTimetable();
        if (!activeTimetable) return;

        const isSelected = activeTimetable.selectedTeachers.some(
          (t) => t.id === teacherId,
        );

        clearClashDetectionCaches();

        set((state) => ({
          timetables: state.timetables.map((t) => {
            if (t.id !== state.activeTimetableId) return t;

            if (isSelected) {
              const newSelectedTeachers = t.selectedTeachers.filter(
                (st) => st.id !== teacherId,
              );
              return {
                ...t,
                selectedTeachers: newSelectedTeachers,
                selectedSlots: Array.from(
                  new Set(newSelectedTeachers.flatMap((st) => st.slots)),
                ),
                updatedAt: new Date(),
              };
            } else {
              const newSelectedTeachers = [...t.selectedTeachers, teacher];
              return {
                ...t,
                selectedTeachers: newSelectedTeachers,
                selectedSlots: Array.from(
                  new Set(newSelectedTeachers.flatMap((st) => st.slots)),
                ),
                updatedAt: new Date(),
              };
            }
          }),
        }));
      },

      isTeacherSelected: (teacherId) => {
        const selectedTeachers = get().getSelectedTeachers();
        return selectedTeachers.some((t) => t.id === teacherId);
      },

      // Clash detection methods (adapted for active timetable)
      teacherSlotClash: (teacherId) => {
        const teacherToConsider = get().teachers.find(
          (t) => t.id === teacherId,
        );
        if (!teacherToConsider) return [];

        const clashes: Teacher[] = [];
        const processedClashingTeacherIds = new Set<string>();

        const currentlySelectedTeachers = get()
          .getSelectedTeachers()
          .filter((t) => t.id !== teacherId);

        for (const slotOfTeacherToConsider of teacherToConsider.slots) {
          const daysForSlotOfTeacherToConsider = getDaysForSlot(
            slotOfTeacherToConsider,
          );

          for (const day of daysForSlotOfTeacherToConsider) {
            for (const otherSelectedTeacher of currentlySelectedTeachers) {
              if (processedClashingTeacherIds.has(otherSelectedTeacher.id))
                continue;

              for (const slotOfOtherTeacher of otherSelectedTeacher.slots) {
                if (getDaysForSlot(slotOfOtherTeacher).includes(day)) {
                  if (
                    doSlotsClash(
                      day,
                      slotOfTeacherToConsider,
                      day,
                      slotOfOtherTeacher,
                    )
                  ) {
                    clashes.push(otherSelectedTeacher);
                    processedClashingTeacherIds.add(otherSelectedTeacher.id);
                    break;
                  }
                }
              }
              if (processedClashingTeacherIds.has(otherSelectedTeacher.id))
                break;
            }
          }
        }
        return clashes;
      },

      hasSameSlotClashWithSelected: (teacherId) => {
        const teacherToConsider = get().teachers.find(
          (t) => t.id === teacherId,
        );
        if (!teacherToConsider) return false;

        const sortedTeacherToConsiderSlots = [...teacherToConsider.slots]
          .sort()
          .join(",");

        const currentlySelectedTeachers = get()
          .getSelectedTeachers()
          .filter((t) => t.id !== teacherId);

        for (const otherSelectedTeacher of currentlySelectedTeachers) {
          if (
            teacherToConsider.course === otherSelectedTeacher.course &&
            sortedTeacherToConsiderSlots ===
              [...otherSelectedTeacher.slots].sort().join(",")
          ) {
            return true;
          }
        }
        return false;
      },

      getSlotClashes: (targetSlot: string) => {
        const selectedTeachers = get().getSelectedTeachers();
        const clashes: ClashInfo[] = [];
        const processedClashPairs = new Set<string>();

        const targetSlotDays = getDaysForSlot(targetSlot);

        if (targetSlotDays.length === 0) return [];

        for (const day of targetSlotDays) {
          const teachersOnThisDay = selectedTeachers.filter((t) =>
            t.slots.some((s) => getDaysForSlot(s).includes(day)),
          );

          const clashingTeachersWithTargetSlot = teachersOnThisDay.filter(
            (teacher) =>
              teacher.slots.some((teacherSlot) =>
                doSlotsClash(day, targetSlot, day, teacherSlot),
              ),
          );

          if (clashingTeachersWithTargetSlot.length < 2) continue;

          for (let i = 0; i < clashingTeachersWithTargetSlot.length; i++) {
            for (
              let j = i + 1;
              j < clashingTeachersWithTargetSlot.length;
              j++
            ) {
              const teacher1 = clashingTeachersWithTargetSlot[i];
              const teacher2 = clashingTeachersWithTargetSlot[j];

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
        const selectedTeachers = get().getSelectedTeachers();
        const clashes: ClashInfo[] = [];
        const processedClashes = new Set<string>();

        for (let i = 0; i < selectedTeachers.length; i++) {
          for (let j = i + 1; j < selectedTeachers.length; j++) {
            const teacher1 = selectedTeachers[i];
            const teacher2 = selectedTeachers[j];

            for (const slot1 of teacher1.slots) {
              for (const slot2 of teacher2.slots) {
                const daysForSlot1 = getDaysForSlot(slot1);
                const daysForSlot2 = getDaysForSlot(slot2);

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

      // Import/Export
      getExportData: () => {
        const { courses, teachers, timetables, activeTimetableId } = get();

        return {
          courses,
          teachers,
          timetables,
          activeTimetableId,
        };
      },

      setExportData: (data) => {
        const {
          courses,
          teachers,
          selectedTeachers,
          selectedSlots,
          timetables,
          activeTimetableId,
        } = data;

        // If importing with timetables data, restore full structure
        if (timetables && activeTimetableId) {
          set({
            courses,
            teachers,
            timetables,
            activeTimetableId,
          });
        } else {
          // Legacy import - create a new timetable with the imported data
          const id = get().createTimetable("Imported Timetable");

          set((state) => ({
            courses,
            teachers,
            timetables: state.timetables.map((t) =>
              t.id === id ? { ...t, selectedTeachers, selectedSlots } : t,
            ),
          }));
        }
      },

      // Utility
      clearAll: () => {
        set({
          courses: [],
          teachers: [],
          timetables: [],
          activeTimetableId: null,
        });
        clearClashDetectionCaches();
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
        timetables: state.timetables,
        activeTimetableId: state.activeTimetableId,
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
