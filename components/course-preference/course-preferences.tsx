"use client";

import { AddCourseDialog } from "@/components/course-preference/dialogs/add-course-dialog";
import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import { DownloadTimetableDialog } from "@/components/course-preference/dialogs/download-timetable";
import { CourseList } from "@/components/course-preference/list/course-list";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  ScrollAnimation,
} from "@/components/ui/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course, Teacher, useScheduleStore } from "@/lib/store";
import { UploadIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BulkAddTeachersDialog } from "./dialogs/add-bulk-teacher-dialog";

export function CoursePreferences() {
  const [editMode, setEditMode] = useState(false);
  const { courses, clearAll, clearSelectedTeachers, setExportData } =
    useScheduleStore();

  const courseCount = useMemo(() => courses.length, [courses]);

  useEffect(() => {
    if (courseCount === 0) setEditMode(false);
  }, [courseCount]);

  const toggleEditMode = useCallback(() => setEditMode((prev) => !prev), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateData = (data: any) => {
    if (
      !Array.isArray(data.courses) ||
      !Array.isArray(data.teachers) ||
      !Array.isArray(data.selectedTeachers) ||
      !Array.isArray(data.selectedSlots)
    ) {
      throw new Error("Invalid data format");
    }

    data.courses.forEach((course: Course) => {
      if (!course.id || !course.code || !course.name) {
        throw new Error("Invalid course data");
      }
    });

    data.teachers.forEach((teacher: Teacher) => {
      if (!teacher.id || !teacher.name || !teacher.course) {
        throw new Error("Invalid teacher data");
      }
    });

    data.selectedTeachers.forEach((teacher: Teacher) => {
      if (!teacher.id || !teacher.name || !teacher.course) {
        throw new Error("Invalid selected teacher data");
      }
    });

    data.selectedSlots.forEach((slot: string) => {
      if (!slot) {
        throw new Error("Invalid selected slot data");
      }
    });
  };

  const handleUploadTimetable = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".ffcsplanner";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            validateData(data);
            setExportData(data);
            toast.success("Imported successfully!");
          } catch (parseError) {
            const errorMessage =
              parseError instanceof Error
                ? parseError.message
                : String(parseError);
            toast.error("Error", { description: errorMessage });
            console.error("Failed to parse file:", parseError);
          }
        };
        reader.readAsText(file);
      } catch (error) {
        toast.error("Failed to read file.");
        console.error("Failed to load timetable:", error);
      }
    };

    input.click();
  }, [setExportData]);

  return (
    <ScrollAnimation animation="fadeIn" duration={0.8}>
      <MotionDiv
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 overflow-hidden"
      >
        {/* Header with staggered animations */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800"
        >
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-lg">Course Preferences</h2>
          </MotionDiv>

          <AnimatePresenceWrapper>
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-2"
            >
              <AnimatePresenceWrapper>
                {courseCount > 0 && (
                  <>
                    <MotionDiv
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <IconButton
                        icon={editMode ? "check" : "edit"}
                        variant={editMode ? "success" : "warning"}
                        size="sm"
                        label={editMode ? "Done" : "Edit"}
                        onClick={toggleEditMode}
                      />
                    </MotionDiv>
                    <MotionDiv
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <BulkAddTeachersDialog
                        buttonVariant="default"
                        buttonSize="sm"
                        disabled={editMode}
                      />
                    </MotionDiv>
                  </>
                )}
              </AnimatePresenceWrapper>

              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <AddCourseDialog
                  courseToEdit={null}
                  buttonVariant="default"
                  buttonSize="sm"
                  disabled={editMode}
                />
              </MotionDiv>
            </MotionDiv>
          </AnimatePresenceWrapper>
        </MotionDiv>

        {/* Content area with scroll animation */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ScrollArea className="h-96">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-4"
            >
              <CourseList editMode={editMode} />
            </MotionDiv>
          </ScrollArea>
        </MotionDiv>

        {/* Footer with button animations */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-end p-4 border-t bg-white dark:bg-gray-800"
        >
          <div className="flex flex-wrap gap-2">
            {[
              {
                component: (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={handleUploadTimetable}
                  >
                    <UploadIcon /> Upload TT
                  </Button>
                ),
                delay: 0.1,
              },
              {
                component: (
                  <DownloadTimetableDialog disabled={courseCount === 0} />
                ),
                delay: 0.2,
              },
              {
                component: (
                  <DeleteDialog
                    description="Are you sure you want to clear selected teachers?"
                    buttonText="Clear Selected"
                    buttonDisabled={courseCount === 0}
                    onConfirm={clearSelectedTeachers}
                  />
                ),
                delay: 0.3,
              },
              {
                component: (
                  <DeleteDialog
                    description="Are you sure you want to clear all courses and teachers?"
                    buttonText="Clear All"
                    buttonDisabled={courseCount === 0}
                    onConfirm={clearAll}
                  />
                ),
                delay: 0.4,
              },
            ].map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.7 + item.delay,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
              >
                {item.component}
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </MotionDiv>
    </ScrollAnimation>
  );
}
