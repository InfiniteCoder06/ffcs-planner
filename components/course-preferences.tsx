"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CourseList } from "./list/course-list";
import { AddCourseDialog } from "./dialogs/add-course-dialog";
import { IconButton } from "./ui/icon-button";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  slideInFromBottom,
} from "./ui/motion";
import { useScheduleStore } from "@/lib/store";
import { DeleteDialog } from "./dialogs/delete-dialog";

export function CoursePreferences() {
  const [editMode, setEditMode] = useState(false);
  const { courses, clearAll, clearSelectedTeachers } = useScheduleStore();

  const courseCount = useMemo(() => courses.length, [courses]);

  useEffect(() => {
    if (courseCount === 0) {
      setEditMode(false);
    }
  }, [courseCount]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className="border rounded-lg">
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

      <div className="pr-4 overflow-y-auto border-b max-h-96 h-96">
        <div className="p-4">
          <CourseList editMode={editMode} />
        </div>
      </div>

      <MotionDiv
        {...slideInFromBottom}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-end p-4"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Save TT
          </Button>
          <Button variant="outline" size="sm">
            Upload TT
          </Button>
          <DeleteDialog
            description="Are you sure you want to clear selected teachers?"
            buttonText="Clear Selected"
            buttonDisabled={courseCount === 0}
            onConfirm={() => clearSelectedTeachers()}
          />
          <DeleteDialog
            description="Are you sure you want to clear all courses and teachers?"
            buttonText="Clear All"
            buttonDisabled={courseCount === 0}
            onConfirm={() => clearAll()}
          />
        </div>
      </MotionDiv>
    </div>
  );
}
