"use client";

import { Check, Plus, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn, type ColorVariant, getColorVariant } from "@/lib/utils";
import { AddTeacherDialog } from "../dialogs/add-teacher-dialog";
import { useScheduleStore, type Teacher } from "@/lib/store";
import { Badge } from "../ui/badge";
import { MotionDiv, MotionLi } from "../ui/motion";
import { DeleteDialog } from "../dialogs/delete-dialog";
import { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
    toggleTeacherInTimetable(teacher.id);
  };

  return (
    <TooltipProvider>
      <MotionLi
        className={cn(
          "p-3 rounded-md flex justify-between items-center gap-2",
          hasClash
            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            : cn(
                "bg-slate-100 dark:bg-slate-800",
                getColorVariant(teacher.color as ColorVariant, [
                  "bg",
                  "bgLight",
                ]),
              ),
        )}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        layout
      >
        <div className={className}>
          <div className="flex items-center gap-2">
            <p className="font-medium">{teacher.name}</p>
            {hasClash && !editMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </MotionDiv>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100"
                >
                  <div className="p-1">
                    <p className="font-bold mb-1">Slot Clash!</p>
                    <div className="text-xs">
                      {clashedTeachers.map((t, i) => {
                        const course = getCourse(t.course);
                        return (
                          <p key={i}>
                            Clashes with {t.name} ({course?.code})
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
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
                hasClash &&
                  isSelected &&
                  "bg-red-200 hover:bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-100",
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
    </TooltipProvider>
  );
}
