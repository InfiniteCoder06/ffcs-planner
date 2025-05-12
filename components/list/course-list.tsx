"use client";

import { useCallback, useMemo, useState } from "react";
import { useScheduleStore } from "@/lib/store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CourseItem from "../items/course-item";
import {
  AnimatePresenceWrapper,
  fadeIn,
  MotionDiv,
  MotionUl,
} from "../ui/motion";

interface CourseListProps {
  editMode: boolean;
}

export function CourseList({ editMode }: CourseListProps) {
  const { courses, teachers } = useScheduleStore();
  const [sortBy, setSortBy] = useState<"code" | "name">("code");

  const getTeachersForCourse = useCallback(
    (courseId: string) => teachers.filter((t) => t.course === courseId),
    [teachers],
  );

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) =>
      sortBy === "code"
        ? a.code.localeCompare(b.code)
        : a.name.localeCompare(b.name),
    );
  }, [courses, sortBy]);

  const handleSortChange = useCallback(
    (value: string) => setSortBy(value as "code" | "name"),
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Your Courses</h3>

        {courses.length > 1 && (
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code">Sort by Code</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {courses.length === 0 ? (
        <MotionDiv
          key="no-courses"
          className="p-4 text-sm text-center text-muted-foreground"
          {...fadeIn}
          transition={{ duration: 0.3 }}
        >
          No courses added yet. Add your first course!
        </MotionDiv>
      ) : (
        <AnimatePresenceWrapper>
          <MotionUl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-3"
            layout
          >
            {sortedCourses.map((course, index) => (
              <CourseItem
                key={course.id}
                index={index}
                course={course}
                courseTeachers={getTeachersForCourse(course.id)}
                editMode={editMode}
              />
            ))}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
