"use client";

import { ChevronUpIcon } from "lucide-react";
import React, { memo, useCallback, useState } from "react";

import { CourseDialog } from "@/components/course-preference/dialogs/course-dialog";
import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import TeacherList from "@/components/course-preference/list/teacher-list";
import { AnimatedButton } from "@/components/ui/button";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  MotionLi,
} from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEditProvider } from "@/src/hooks/useEditProvider";
import { Course, Teacher } from "@/types";

interface CourseItemProps {
  index: number;
  course: Course;
  courseTeachers: Teacher[];
}

const CourseItem = React.memo(function CourseItem({
  index,
  course,
  courseTeachers,
}: CourseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

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
          <CourseItemActions course={course} isExpanded={isExpanded} />
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
            <TeacherList courseTeachers={courseTeachers} course={course} />
          </MotionDiv>
        )}
      </AnimatePresenceWrapper>
    </MotionLi>
  );
});

const CourseItemActions = memo(
  ({ course, isExpanded }: { course: Course; isExpanded: boolean }) => {
    const { removeCourse } = useScheduleStore();
    const { editMode } = useEditProvider();

    const handleRemove = useCallback(() => {
      removeCourse(course.id);
    }, [course.id, removeCourse]);

    return (
      <>
        {editMode && (
          <>
            <CourseDialog
              courseToEdit={course}
              variant="secondary"
              size="icon"
              buttonIcon="edit"
            />
            <DeleteDialog
              description="Are you sure you want to remove this course?"
              onConfirm={handleRemove}
              size={"icon"}
            />
          </>
        )}
        <AnimatedButton
          variant="ghost"
          size="icon"
          aria-label={isExpanded ? "Collapse teachers" : "Expand teachers"}
          className="transition-transform duration-200"
        >
          <ChevronUpIcon
            className={cn("w-4 h-4 transition-transform", {
              "rotate-180": !isExpanded,
            })}
          />
        </AnimatedButton>
      </>
    );
  },
);
CourseItemActions.displayName = "CourseItemActions";
export default CourseItem;
