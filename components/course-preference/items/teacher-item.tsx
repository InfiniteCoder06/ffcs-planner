"use client";

import { AlertCircle, Check, Plus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

import { DeleteDialog } from "@/components/course-preference/dialogs/delete-dialog";
import { TeacherDialog } from "@/components/course-preference/dialogs/teacher-dialog";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/button";
import { MotionDiv, MotionLi } from "@/components/ui/motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEditProvider } from "@/src/hooks/useEditProvider";
import { getAllSlots, isAfternoonTheory } from "@/src/utils/timetable";
import { Teacher } from "@/types";

interface TeacherItemProps {
  teacher: Teacher;
  isSelected: boolean;
  clashedTeachers: Teacher[];
  className?: string;
  index: number;
  highlightedSlot?: string;
  hasSameSlotClash: boolean;
}

export default function TeacherItem({
  teacher,
  clashedTeachers,
  className,
  isSelected,
  index,
  highlightedSlot,
  hasSameSlotClash,
}: TeacherItemProps) {
  const { getCourse } = useScheduleStore();
  const hasClash = clashedTeachers.length > 0;

  const teacherNameEnh = useMemo(() => {
    const mergedSlots = [
      ...(teacher.slots.morning ?? []),
      ...(teacher.slots.afternoon ?? []),
    ];
    if (mergedSlots.length > 0) {
      if (isAfternoonTheory(mergedSlots[0])) {
        return `${teacher.name} (E)`;
      }
      return teacher.name;
    }
  }, [teacher]);

  const renderSlots = () => {
    const allSlots: string[] = getAllSlots(teacher);

    return allSlots.map((slot, slotIndex) => {
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
  };

  return (
    <TooltipProvider>
      <MotionLi
        className={cn(
          "p-3 rounded-lg border flex justify-between items-center gap-2",
          hasSameSlotClash
            ? "bg-yellow-ui"
            : hasClash
              ? "bg-red-ui"
              : `bg-${teacher.color}-ui`,
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
            <p className="font-medium">{teacherNameEnh}</p>
            {hasClash && (
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
                    <AlertCircle
                      className={cn(
                        hasSameSlotClash ? "text-yellow-dim" : "text-red-dim",
                      )}
                    />
                  </MotionDiv>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className={cn(
                    "border-2 p-1",
                    hasSameSlotClash
                      ? "bg-yellow-ui text-yellow-normal border-yellow-normal"
                      : "bg-red-ui text-red-normal border-red-normal",
                  )}
                >
                  <div className="p-1">
                    <p className="font-bold mb-1">
                      {hasSameSlotClash
                        ? "Identical Slot Clash!"
                        : "Slot Clash!"}
                    </p>
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
          {(teacher.venue.morning || teacher.venue.afternoon) && (
            <p className="text-xs text-muted-foreground">
              Venue:{" "}
              {[
                teacher.venue.morning && `M: ${teacher.venue.morning}`,
                teacher.venue.afternoon && `A: ${teacher.venue.afternoon}`,
              ]
                .filter(Boolean)
                .map((venue, index) => (
                  <span key={index} className="font-medium">
                    {index > 0 && " | "}
                    {venue}
                  </span>
                ))}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {renderSlots()}{" "}
          <TeacherItemActions
            teacher={teacher}
            isSelected={isSelected}
            hasClash={hasClash}
          />
        </div>
      </MotionLi>
    </TooltipProvider>
  );
}

const TeacherItemActions = memo(
  ({
    teacher,
    isSelected,
    hasClash,
  }: {
    teacher: Teacher;
    isSelected: boolean;
    hasClash: boolean;
  }) => {
    const { removeTeacher, toggleTeacherInTimetable } = useScheduleStore();
    const { editMode } = useEditProvider();

    const handleButtonClick = useCallback(() => {
      toggleTeacherInTimetable(teacher.id);
    }, [teacher.id, toggleTeacherInTimetable]);

    const handleRemove = useCallback(() => {
      removeTeacher(teacher.id);
    }, [teacher.id, removeTeacher]);

    return (
      <>
        {editMode ? (
          <>
            <TeacherDialog
              teacherToEdit={teacher}
              variant="yellowSolid"
              size="icon"
              buttonIcon="edit"
              course={null}
            />
            <DeleteDialog
              description="Are you sure you want to remove this teacher?"
              onConfirm={handleRemove}
              size={"icon"}
              useSolid
            />
          </>
        ) : (
          <AnimatedButton
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
          </AnimatedButton>
        )}
      </>
    );
  },
);
TeacherItemActions.displayName = "TeacherItemActions";
