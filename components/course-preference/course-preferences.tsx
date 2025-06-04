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
  slideInFromBottom,
} from "@/components/ui/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course, Teacher, useScheduleStore } from "@/lib/store";
import { UploadIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
    <ScrollAnimation animation="fadeIn" duration={0.6}>
      <div className="border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">Course Preferences</h2>
          <AnimatePresenceWrapper>
            <MotionDiv
              {...slideInFromBottom}
              transition={{ duration: 0.5 }}
              className="flex gap-2"
            >
              {courseCount > 0 && (
                <IconButton
                  icon={editMode ? "check" : "edit"}
                  variant={editMode ? "success" : "warning"}
                  size="sm"
                  label={editMode ? "Done" : "Edit"}
                  onClick={toggleEditMode}
                />
              )}
              <AddCourseDialog
                courseToEdit={null}
                buttonVariant="default"
                buttonSize="sm"
                disabled={editMode}
              />
            </MotionDiv>
          </AnimatePresenceWrapper>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4">
            <CourseList editMode={editMode} />
          </div>
        </ScrollArea>

        <MotionDiv
          {...slideInFromBottom}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-end p-4 border-t"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="warning" size="sm" onClick={handleUploadTimetable}>
              <UploadIcon /> Upload TT
            </Button>
            <DownloadTimetableDialog disabled={courseCount === 0} />
            <DeleteDialog
              description="Are you sure you want to clear selected teachers?"
              buttonText="Clear Selected"
              buttonDisabled={courseCount === 0}
              onConfirm={clearSelectedTeachers}
            />
            <DeleteDialog
              description="Are you sure you want to clear all courses and teachers?"
              buttonText="Clear All"
              buttonDisabled={courseCount === 0}
              onConfirm={clearAll}
            />
          </div>
        </MotionDiv>
      </div>
    </ScrollAnimation>
  );
}
