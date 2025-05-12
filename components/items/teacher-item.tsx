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
  highlightedSlot?: string;
}

export default function TeacherItem({
  teacher,
  editMode,
  clashedTeachers,
  className,
  index,
  highlightedSlot,
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
    teacher.slots.map((slot, slotIndex) => {
      const isHighlighted = highlightedSlot === slot;

      return (
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
              isHighlighted && "ring-2 ring-offset-1 ring-primary",
              className,
            )}
          >
            {slot}
          </Badge>
        </MotionDiv>
      );
    });

  const handleButtonClick = () => {
    toggleTeacherInTimetable(teacher.id);
  };

  return (
    <TooltipProvider>
      <MotionLi
        className={cn(
          "p-3 rounded-md flex justify-between items-center gap-2",
          hasClash
            ? getColorVariant("red", ["bgLight", "border"])
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
                    <AlertCircle className={cn(getColorVariant("red", ["text"]))} />
                  </MotionDiv>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className={cn(getColorVariant("red", ["bgLight", "border", "text"]))}
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
                isSelected && getColorVariant(
                  "red",
                  ["bgLight", "bgHover", "text"],
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
    </TooltipProvider>
  );
}
