"use client";

import { useMemo } from "react";
import { useScheduleStore, type Teacher } from "@/lib/store";
import { AddTeacherDialog } from "../dialogs/add-teacher-dialog";
import TeacherItem from "../items/teacher-item";

interface TeacherListProps {
  courseTeachers: Teacher[];
  editMode: boolean;
}

export default function TeacherList({
  courseTeachers,
  editMode,
}: TeacherListProps) {
  const { teacherSlotClash } = useScheduleStore();

  const { clashedTeachers, unclashedTeachers } = useMemo(() => {
    const clashed: { teacher: Teacher; clashes: Teacher[] }[] = [];
    const unclashed: Teacher[] = [];

    for (const teacher of courseTeachers) {
      const clashes = teacherSlotClash(teacher.id);
      if (clashes.length > 0) {
        clashed.push({ teacher, clashes });
      } else {
        unclashed.push(teacher);
      }
    }

    return {
      clashedTeachers: clashed,
      unclashedTeachers: unclashed,
    };
  }, [courseTeachers, teacherSlotClash]);

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

      {courseTeachers.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No teachers assigned to this course yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {unclashedTeachers.map((teacher) => (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              editMode={editMode}
              clashedTeachers={[]}
            />
          ))}

          {clashedTeachers.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">Teachers clashing</p>
              {clashedTeachers.map(({ teacher, clashes }) => (
                <TeacherItem
                  key={teacher.id}
                  teacher={teacher}
                  editMode={editMode}
                  clashedTeachers={clashes}
                  className="opacity-50"
                />
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
