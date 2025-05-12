"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn, type ColorVariant, getColorVariant } from "@/lib/utils";
import { AddTeacherDialog } from "../dialogs/add-teacher-dialog";
import { useScheduleStore, type Teacher } from "@/lib/store";
import { Badge } from "../ui/badge";
import { MotionDiv, MotionLi } from "../ui/motion";
import { toast } from "sonner";
import { DeleteDialog } from "../dialogs/delete-dialog";
import { useCallback } from "react";

interface TeacherItemProps {
  teacher: Teacher;
  editMode: boolean;
  clashedTeachers: Teacher[];
  className?: string;
  index: number;
}

export default function TeacherItem({
  teacher,
  editMode,
  clashedTeachers,
  className,
  index,
}: TeacherItemProps) {
  const {
    getCourse,
    removeTeacher,
    toggleTeacherInTimetable,
    isTeacherSelected,
  } = useScheduleStore();
  const isSelected = isTeacherSelected(teacher.id);
  const hasClash = clashedTeachers.length > 0;

  const handleRemove = useCallback(() => {
    removeTeacher(teacher.id);
  }, [teacher.id, removeTeacher]);

  const handleClashToast = () => {
    toast.error("Clashing Teachers", {
      description: (
        <ul>
          {clashedTeachers.map((clashedTeacher) => (
            <li key={clashedTeacher.id}>
              {clashedTeacher.name}
              <ol className="pl-4 list-disc">
                <li>
                  Course:{" "}
                  {getCourse(clashedTeacher.course)?.name ?? "Unknown Course"}
                </li>
                <li>{clashedTeacher.slots.join(", ")}</li>
              </ol>
            </li>
          ))}
        </ul>
      ),
    });
  };

  const renderSlots = () =>
    teacher.slots.map((slot, slotIndex) => (
      <MotionDiv
        key={slotIndex}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: slotIndex * 0.05 + index * 0.03 }}
      >
        <Badge
          variant="outline"
          className={cn(
            "border-none select-none rounded-full",
            getColorVariant(teacher.color as ColorVariant, ["border", "bg"]),
            className,
          )}
        >
          {slot}
        </Badge>
      </MotionDiv>
    ));

  const handleButtonClick = () => {
    if (hasClash) {
      handleClashToast();
    } else {
      toggleTeacherInTimetable(teacher.id);
    }
  };

  return (
    <MotionLi
      className={cn(
        "p-3 rounded-md flex justify-between items-center gap-2 bg-slate-100 dark:bg-slate-800",
        getColorVariant(teacher.color as ColorVariant, ["bg", "bgLight"]),
      )}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      layout
    >
      <div className={className}>
        <p className="font-medium">{teacher.name}</p>
        {teacher.venue && (
          <p className="text-xs text-muted-foreground">
            Venue: {teacher.venue}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {renderSlots()}
        {editMode ? (
          <>
            <AddTeacherDialog
              teacherToEdit={teacher}
              buttonVariant="warning"
              buttonSize="sm"
              buttonIcon="edit"
              buttonText=""
            />
            <DeleteDialog
              description="Are you sure you want to remove this teacher?"
              onConfirm={handleRemove}
            />
          </>
        ) : (
          <Button
            key={`${teacher.id}-${isSelected}`}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 w-8",
              getColorVariant(
                teacher.color as ColorVariant,
                isSelected ? ["bg", "bgHover", "text"] : ["text"],
              ),
            )}
            onClick={handleButtonClick}
          >
            {isSelected ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </MotionLi>
  );
}
