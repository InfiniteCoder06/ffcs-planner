"use client";

import { AddTeacherDialog } from "@/components/course-preference/dialogs/add-teacher-dialog";
import TeacherItem from "@/components/course-preference/items/teacher-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  MotionUl,
} from "@/components/ui/motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Course, useScheduleStore, type Teacher } from "@/lib/store";
import { Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DeleteDialog } from "../dialogs/delete-dialog";
import { cn } from "@/lib/utils";

interface TeacherListProps {
  courseTeachers: Teacher[];
  editMode: boolean;
  course: Course;
}

export default function TeacherList({
  courseTeachers,
  editMode,
  course,
}: TeacherListProps) {
  const {
    teacherSlotClash,
    deleteAllTeachersForCourse,
    isTeacherSelected,
    hasSameSlotClashWithSelected,
  } = useScheduleStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [slotFilter, setSlotFilter] = useState<string>("");
  const [colorFilter, setColorFilter] = useState<string>("");

  const availableSlots = useMemo(() => {
    const slots = new Set<string>();
    courseTeachers.forEach((teacher) => {
      teacher.slots.forEach((slot) => {
        if (slot.startsWith("L")) {
          const slotNumber = parseInt(slot.slice(1), 10);
          if (slotNumber % 2 === 1) {
            slots.add(`L${slotNumber} + L${slotNumber + 1}`);
          }
        } else {
          slots.add(slot);
        }
      });
    });
    return Array.from(slots).sort((a, b) => {
      const getSlotInfo = (slot: string) => {
        if (slot.includes("+")) {
          const firstSlot = slot.split(" + ")[0];
          const type = firstSlot.charAt(0);
          const number = parseInt(firstSlot.slice(1), 10);
          return { type, number };
        } else {
          const type = slot.charAt(0);
          const number = parseInt(slot.slice(1), 10) || 0;
          return { type, number };
        }
      };

      const aInfo = getSlotInfo(a);
      const bInfo = getSlotInfo(b);

      if (aInfo.type !== bInfo.type) {
        if (aInfo.type === "T" && bInfo.type === "L") return -1;
        if (aInfo.type === "L" && bInfo.type === "T") return 1;
        if (aInfo.type === "T" && bInfo.type === "T")
          return aInfo.number - bInfo.number;
      }

      return aInfo.number - bInfo.number;
    });
  }, [courseTeachers]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    courseTeachers.forEach((teacher) => {
      colors.add(teacher.color);
    });
    return Array.from(colors).sort();
  }, [courseTeachers]);

  const filteredTeacherStates = useMemo(() => {
    const filtered = courseTeachers.filter((teacher) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchLower) ||
        (teacher.venue && teacher.venue.toLowerCase().includes(searchLower)) ||
        teacher.slots.some((slot) => slot.toLowerCase().includes(searchLower));

      const matchesSlotFilter =
        !slotFilter || teacher.slots.includes(slotFilter.split(" + ")[0]);

      const matchesColorFilter = !colorFilter || teacher.color === colorFilter;

      return matchesSearch && matchesSlotFilter && matchesColorFilter;
    });

    return filtered
      .map((teacher) => {
        const clashes = teacherSlotClash(teacher.id);
        const isSelected = isTeacherSelected(teacher.id);
        const hasSameSlotClash = hasSameSlotClashWithSelected(teacher.id);
        return {
          teacher,
          clashes,
          isSelected,
          hasSameSlotClash,
        };
      })
      .sort((a, b) => {
        // 1. Prioritize selected teachers
        if (a.isSelected && !b.isSelected) return -1;
        if (!a.isSelected && b.isSelected) return 1;

        // If both are selected or both are not selected, proceed to clash logic
        const aIsClashing = a.clashes.length > 0;
        const bIsClashing = b.clashes.length > 0;

        // 2. Prioritize non-clashing over clashing
        if (!aIsClashing && bIsClashing) return -1; // a (no clash) before b (clash)
        if (aIsClashing && !bIsClashing) return 1; // b (no clash) before a (clash)

        // If both are clashing (or both are non-clashing), proceed to identical slot clash
        if (aIsClashing && bIsClashing) {
          // 3. Prioritize identical slot clashes (yellow) over other clashes (red)
          if (a.hasSameSlotClash && !b.hasSameSlotClash) return -1; // a (yellow) before b (red)
          if (!a.hasSameSlotClash && b.hasSameSlotClash) return 1; // b (yellow) before a (red)
        }

        // 4. Sort by color preference
        if (colorFilter) {
          const aMatchesColor = a.teacher.color === colorFilter;
          const bMatchesColor = b.teacher.color === colorFilter;
          if (aMatchesColor && !bMatchesColor) return -1;
          if (!aMatchesColor && bMatchesColor) return 1;
        }
        // If no color filter or both match/don't match, sort alphabetically by color
        const colorCompare = a.teacher.color.localeCompare(b.teacher.color);
        if (colorCompare !== 0) return colorCompare;

        // 5. Finally, if all above are equal, sort by teacher name for stable order
        return a.teacher.name.localeCompare(b.teacher.name);
      });
  }, [
    courseTeachers,
    teacherSlotClash,
    searchQuery,
    slotFilter,
    colorFilter,
    isTeacherSelected,
    hasSameSlotClashWithSelected,
  ]);

  const handleDeleteAllTeachers = useCallback(() => {
    deleteAllTeachersForCourse(course.id);
  }, [course.id, deleteAllTeachersForCourse]);

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          Teachers ({courseTeachers.length})
        </p>
        <div className="flex items-center gap-2">
          <AddTeacherDialog
            teacherToEdit={null}
            buttonVariant="ghost"
            buttonSize="sm"
            course={course.id}
          />
          {courseTeachers.length > 0 && (
            <DeleteDialog
              description={`Are you sure you want to remove ALL ${courseTeachers.length} teachers for ${course.code}? This action cannot be undone.`}
              onConfirm={handleDeleteAllTeachers}
              buttonText="Clear Teachers"
              buttonDisabled={courseTeachers.length === 0}
            />
          )}
        </div>
      </div>

      {courseTeachers.length > 0 && (
        <>
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers, venues or slots..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Select
              value={slotFilter}
              onValueChange={(value) => setSlotFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      Slot {slot}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <AnimatePresenceWrapper>
              {slotFilter && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSlotFilter("")}
                  className="h-9 w-9 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </AnimatePresenceWrapper>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Select
              value={colorFilter}
              onValueChange={(value) => setColorFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by color" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full",
                            `bg-${color}-solid`,
                          )}
                        />
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <AnimatePresenceWrapper>
              {colorFilter && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setColorFilter("")}
                  className="h-9 w-9 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </AnimatePresenceWrapper>
          </div>
        </>
      )}

      {courseTeachers.length === 0 ? (
        <MotionDiv
          className="p-4 text-center border rounded-lg text-muted-foreground"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          No teachers selected. Add teachers to your timetable to see them here.
        </MotionDiv>
      ) : filteredTeacherStates.length === 0 ? (
        <MotionDiv
          className="p-4 text-center border rounded-lg text-muted-foreground"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          No teachers match your {slotFilter ? "filter and " : ""}search.
        </MotionDiv>
      ) : (
        <AnimatePresenceWrapper>
          <MotionUl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
            layout
          >
            {filteredTeacherStates.map(
              ({ teacher, clashes, hasSameSlotClash }, index) => (
                <TeacherItem
                  key={teacher.id}
                  teacher={teacher}
                  editMode={editMode}
                  clashedTeachers={clashes}
                  className={clashes.length > 0 ? "opacity-50" : ""}
                  index={index}
                  hasSameSlotClash={hasSameSlotClash}
                />
              ),
            )}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
