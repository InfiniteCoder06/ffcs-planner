"use client";

import { useCallback, useMemo, useState } from "react";

import { TeacherDialog } from "@/components/course-preference/dialogs/teacher-dialog";
import TeacherItem from "@/components/course-preference/items/teacher-item";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  MotionUl,
} from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import { getAllSlots } from "@/src/utils/timetable";
import { Course, Teacher } from "@/types";

import { DeleteDialog } from "../dialogs/delete-dialog";
import { SearchBar } from "../ui/search-bar";
import { CustomSortMenu } from "../ui/sort-menu";

interface TeacherListProps {
  courseTeachers: Teacher[];
  course: Course;
}

export default function TeacherList({
  courseTeachers,
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
      const allSlots: string[] = getAllSlots(teacher);

      allSlots.forEach((slot) => {
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

      // Get all slots for the teacher
      const allSlots: string[] = getAllSlots(teacher);

      // Get all venues for the teacher
      const allVenues = [teacher.venue.morning, teacher.venue.afternoon].filter(
        Boolean,
      );

      const matchesSearch =
        teacher.name.toLowerCase().includes(searchLower) ||
        allVenues.some((venue) => venue?.toLowerCase().includes(searchLower)) ||
        allSlots.some((slot) => slot.toLowerCase().includes(searchLower));

      const matchesSlotFilter =
        !slotFilter || allSlots.includes(slotFilter.split(" + ")[0]);

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

        // 2. Prioritize identical slot clashes (yellow) first
        if (a.hasSameSlotClash && !b.hasSameSlotClash) return -1;
        if (!a.hasSameSlotClash && b.hasSameSlotClash) return 1;

        // 3. Prioritize non-clashing over other clashes
        const aIsClashing = a.clashes.length > 0;
        const bIsClashing = b.clashes.length > 0;
        const aHasOtherClash = aIsClashing && !a.hasSameSlotClash;
        const bHasOtherClash = bIsClashing && !b.hasSameSlotClash;

        if (!aIsClashing && bHasOtherClash) return -1; // no clash before other clash
        if (aHasOtherClash && !bIsClashing) return 1; // no clash before other clash

        // 4. Sort by color preference - matching color filter comes first
        if (colorFilter) {
          const aMatchesColor = a.teacher.color === colorFilter;
          const bMatchesColor = b.teacher.color === colorFilter;
          if (aMatchesColor && !bMatchesColor) return -1;
          if (!aMatchesColor && bMatchesColor) return 1;
        }

        // 5. Sort alphabetically by color
        const colorCompare = a.teacher.color.localeCompare(b.teacher.color);
        if (colorCompare !== 0) return colorCompare;

        // 6. Finally, sort alphabetically by teacher name
        return a.teacher.name.localeCompare(b.teacher.name);
      });
  }, [
    courseTeachers,
    searchQuery,
    slotFilter,
    colorFilter,
    teacherSlotClash,
    isTeacherSelected,
    hasSameSlotClashWithSelected,
  ]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleColorChange = useCallback((value: string) => {
    setColorFilter(value);
  }, []);

  const handleSlotChange = useCallback((value: string) => {
    setSlotFilter(value);
  }, []);

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
          <TeacherDialog
            teacherToEdit={null}
            variant="secondary"
            size="sm"
            course={course.id}
            buttonText="Add Teacher"
            buttonIcon={"add"}
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
        <div className="flex mb-2 flex-col w-full">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <CustomSortMenu
            value={colorFilter}
            onChange={handleColorChange}
            values={availableColors}
            placeholder="Filter by Color"
          />
          <CustomSortMenu
            value={slotFilter}
            onChange={handleSlotChange}
            values={availableSlots}
            placeholder="Filter by Slots"
          />
        </div>
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
              ({ teacher, clashes, hasSameSlotClash, isSelected }, index) => (
                <TeacherItem
                  key={teacher.id}
                  teacher={teacher}
                  clashedTeachers={clashes}
                  className={clashes.length > 0 ? "opacity-50" : ""}
                  index={index}
                  hasSameSlotClash={hasSameSlotClash}
                  isSelected={isSelected}
                />
              ),
            )}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
