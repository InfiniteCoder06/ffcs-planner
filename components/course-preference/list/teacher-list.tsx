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
import { useScheduleStore, type Teacher } from "@/lib/store";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface TeacherListProps {
  courseTeachers: Teacher[];
  editMode: boolean;
}

export default function TeacherList({
  courseTeachers,
  editMode,
}: TeacherListProps) {
  const { teacherSlotClash } = useScheduleStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [slotFilter, setSlotFilter] = useState<string>("");

  // Extract all unique slots from the teachers
  const availableSlots = useMemo(() => {
    const slots = new Set<string>();
    courseTeachers.forEach((teacher) => {
      teacher.slots.forEach((slot) => slots.add(slot));
    });
    return Array.from(slots).sort();
  }, [courseTeachers]);

  const filteredTeacherStates = useMemo(() => {
    const filtered = courseTeachers.filter((teacher) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchLower) ||
        (teacher.venue && teacher.venue.toLowerCase().includes(searchLower)) ||
        teacher.slots.some((slot) => slot.toLowerCase().includes(searchLower));

      // Apply slot filter if selected
      const matchesSlotFilter =
        !slotFilter || teacher.slots.includes(slotFilter);

      return matchesSearch && matchesSlotFilter;
    });

    return filtered
      .map((teacher) => {
        const clashes = teacherSlotClash(teacher.id);
        return {
          teacher,
          clashes,
        };
      })
      .sort((a, b) => a.clashes.length - b.clashes.length); // Non-clashing first
  }, [courseTeachers, teacherSlotClash, searchQuery, slotFilter]);

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          Teachers ({courseTeachers.length})
        </p>
        <AddTeacherDialog
          teacherToEdit={null}
          buttonVariant="ghost"
          buttonSize="sm"
        />
      </div>

      {courseTeachers.length > 0 && (
        <>
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers, venues or slots..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
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
            {filteredTeacherStates.map(({ teacher, clashes }, index) => (
              <TeacherItem
                key={teacher.id}
                teacher={teacher}
                editMode={editMode}
                clashedTeachers={clashes}
                className={clashes.length > 0 ? "opacity-50" : ""}
                index={index}
              />
            ))}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
