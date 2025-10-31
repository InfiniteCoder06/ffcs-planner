import { ChevronUpIcon } from "lucide-react";
import { memo, useCallback } from "react";

import { AnimatedButton } from "@/components/ui/button";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEditProvider } from "@/src/hooks/useEditProvider";
import { Course } from "@/types";

import { CourseDialog } from "../../dialogs/course-dialog";
import { DeleteDialog } from "../../dialogs/delete-dialog";

interface CourseItemActionsProps {
  course: Course;
  isExpanded: boolean;
}

export default function CourseItemActions({
  course,
  isExpanded,
}: CourseItemActionsProps) {
  return (
    <>
      <EditActions course={course} />
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
}

const EditActions = memo(({ course }: { course: Course }) => {
  const removeCourse = useScheduleStore((state) => state.removeCourse);
  const { editMode } = useEditProvider();

  const handleRemove = useCallback(() => {
    removeCourse(course.id);
  }, [course.id, removeCourse]);

  if (!editMode) return null;

  return (
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
        size="icon"
      />
    </>
  );
});
EditActions.displayName = "EditActions";
