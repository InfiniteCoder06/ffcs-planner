"use client";

import { UploadIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";

import { CourseDialog } from "@/components/course-preference/dialogs/course-dialog";
import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import { DownloadTimetableDialog } from "@/components/course-preference/dialogs/download-timetable";
import { CourseList } from "@/components/course-preference/list/course-list";
import { AnimatedButton } from "@/components/ui/button";
import { MotionDiv } from "@/components/ui/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScheduleStore } from "@/lib/store";
import { useEditProvider } from "@/src/hooks/useEditProvider";
import { Course, Teacher } from "@/types";

import { EditIcon } from "../icon-memo";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { BulkAddTeachersDialog } from "./dialogs/add-bulk-teacher-dialog";

export function CoursePreference() {
  return (
    <Card className="container m-3 mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Preference</CardTitle>
        <CoursePreferenceHeaderActions />
      </CardHeader>
      <CoursePreferenceContent />
      <CoursePreferenceFooter />
    </Card>
  );
}

const CoursePreferenceHeaderActions = memo(() => {
  const { editMode, toggleEditMode } = useEditProvider();
  return (
    <div className="flex items-center gap-2">
      <AnimatedButton
        variant="secondary"
        onClick={toggleEditMode}
        leftIcon={<EditIcon />}
      >
        {editMode ? "View Mode" : "Edit Mode"}
      </AnimatedButton>
      <BulkAddTeachersDialog variant="secondary" />
      <CourseDialog buttonText="Add Course" buttonIcon="add" />
    </div>
  );
});
CoursePreferenceHeaderActions.displayName = "CoursePreferenceHeaderActions";

const CoursePreferenceContent = memo(() => {
  return (
    <CardContent className="min-h-[300px] p-4">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Separator className="mb-4" />
        <ScrollArea className="h-96">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-4"
          >
            <CourseList />
          </MotionDiv>
        </ScrollArea>
      </MotionDiv>
      <Separator className="mt-4" />
    </CardContent>
  );
});
CoursePreferenceContent.displayName = "CoursePreferenceContent";

const CoursePreferenceFooter = memo(() => {
  const { courses, setExportData, clearAll, clearSelectedTeachers } =
    useScheduleStore();

  const courseCount = useMemo(() => courses.length, [courses]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateData = (data: any) => {
    if (
      !Array.isArray(data.courses) ||
      !Array.isArray(data.teachers)
      // !Array.isArray(data.timetables) ||
      // !data.activeTimetableId
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

    // data.timetables.forEach((timetable: Timetable) => {
    //   if (
    //     !timetable.id ||
    //     !timetable.name ||
    //     !Array.isArray(timetable.selectedTeachers)
    //   ) {
    //     throw new Error("Invalid timetable data");
    //   }

    //   timetable.selectedTeachers.forEach((teacher: Teacher) => {
    //     if (!teacher.id || !teacher.name || !teacher.course) {
    //       throw new Error("Invalid selected teacher data");
    //     }
    //   });

    //   timetable.selectedSlots.forEach((slot: string) => {
    //     if (!slot) {
    //       throw new Error("Invalid selected slot data");
    //     }
    //   });
    // });
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
    <CardFooter className="flex justify-end gap-2">
      <AnimatedButton
        variant="secondary"
        size="sm"
        onClick={handleUploadTimetable}
      >
        <UploadIcon /> Upload TT
      </AnimatedButton>
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
    </CardFooter>
  );
});
CoursePreferenceFooter.displayName = "CoursePreferenceFooter";
