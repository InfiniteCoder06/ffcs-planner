"use client";

import { AddTeacherDialog } from "@/components/course-preference/dialogs/add-teacher-dialog";
import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionDiv, MotionLi } from "@/components/ui/motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScheduleStore, type Teacher } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Plus } from "lucide-react";
import { useCallback } from "react";

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
              `bg-${teacher.color}-solid text-white`,

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
          hasClash ? "bg-red-ui" : `bg-${teacher.color}-ui`,
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
                    <AlertCircle className={cn("text-red-dim")} />
                  </MotionDiv>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className={`border-2 bg-red-ui text-red-normal border-red-normal`}
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
                buttonVariant="warningSolid"
                buttonSize="sm"
                buttonIcon="edit"
                buttonText=""
                course={null}
              />
              <DeleteDialog
                description="Are you sure you want to remove this teacher?"
                onConfirm={handleRemove}
                useSolid
              />
            </>
          ) : (
            <Button
              key={`${teacher.id}-${isSelected}`}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-8 w-8",
                isSelected
                  ? `bg-${teacher.color}-solid text-white`
                  : `text-${teacher.color}-dim`,
                hasClash && isSelected && `bg-red-solid text-white`,
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
