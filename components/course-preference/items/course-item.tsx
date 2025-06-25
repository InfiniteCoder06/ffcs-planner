"use client";

import { useScheduleStore } from "@/lib/store";
import { ChevronUpIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

import { AddCourseDialog } from "@/components/course-preference/dialogs/add-course-dialog";
import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import TeacherList from "@/components/course-preference/list/teacher-list";
import { Button } from "@/components/ui/button";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  MotionLi,
} from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { Course, Teacher } from "@/types";

interface CourseItemProps {
  index: number;
  course: Course;
  courseTeachers: Teacher[];
  editMode: boolean;
}

const CourseItem = React.memo(function CourseItem({
  index,
  course,
  courseTeachers,
  editMode,
}: CourseItemProps) {
  const { removeCourse } = useScheduleStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleRemove = useCallback(() => {
    removeCourse(course.id);
  }, [course.id, removeCourse]);

  return (
    <MotionLi
      className="overflow-hidden border rounded-md shadow-sm"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.05,
      }}
      whileHover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div>
          <p className="font-medium">{course.code}</p>
          <p className="text-sm text-muted-foreground">
            {course.name} • {course.credits} Credits
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label={isExpanded ? "Collapse teachers" : "Expand teachers"}
            className="transition-transform duration-200"
          >
            <ChevronUpIcon
              className={cn("w-4 h-4 transition-transform", {
                "rotate-180": !isExpanded,
              })}
            />
          </Button>
          {editMode && (
            <>
              <AddCourseDialog
                courseToEdit={course}
                buttonVariant="warning"
                buttonSize="sm"
                buttonIcon="edit"
                buttonText=""
              />
              <DeleteDialog
                description="Are you sure you want to remove this course?"
                onConfirm={handleRemove}
              />
            </>
          )}
        </div>
      </div>
      <AnimatePresenceWrapper>
        {isExpanded && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <TeacherList
              courseTeachers={courseTeachers}
              editMode={editMode}
              course={course}
            />
          </MotionDiv>
        )}
      </AnimatePresenceWrapper>
    </MotionLi>
  );
});

export default CourseItem;
