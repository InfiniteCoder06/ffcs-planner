"use client";

import { useCallback, useMemo, useState } from "react";

import {
  AnimatePresenceWrapper,
  fadeIn,
  MotionDiv,
  MotionUl,
} from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";

import CourseItem from "../items/course-item/course-item";
import { SearchBar } from "../ui/search-bar";
import { CourseSortMenu } from "../ui/sort-menu";

export function CourseList() {
  const { courses, teachers } = useScheduleStore();
  const [sortBy, setSortBy] = useState<"code" | "name">("code");
  const [searchQuery, setSearchQuery] = useState("");

  const getTeachersForCourse = useCallback(
    (courseId: string) => teachers.filter((t) => t.course === courseId),
    [teachers],
  );

  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        course.code.toLowerCase().includes(searchLower) ||
        course.name.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) =>
      sortBy === "code"
        ? a.code.localeCompare(b.code)
        : a.name.localeCompare(b.name),
    );
  }, [courses, sortBy, searchQuery]);

  const handleSortChange = useCallback(
    (value: string) => setSortBy(value as "code" | "name"),
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Your Courses</h3>

        {courses.length > 1 && (
          <CourseSortMenu value={sortBy} onChange={handleSortChange} />
        )}
      </div>

      {courses.length > 0 && (
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      )}

      {courses.length === 0 ? (
        <MotionDiv
          key="no-courses"
          className="p-4 text-sm text-center text-muted-foreground"
          {...fadeIn}
          transition={{ duration: 0.3 }}
        >
          No courses added yet. Add your first course!
        </MotionDiv>
      ) : filteredAndSortedCourses.length === 0 ? (
        <MotionDiv
          key="no-results"
          className="p-4 text-sm text-center text-muted-foreground"
          {...fadeIn}
          transition={{ duration: 0.3 }}
        >
          No courses match your search.
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
            {filteredAndSortedCourses.map((course, index) => (
              <CourseItem
                key={course.id}
                index={index}
                course={course}
                courseTeachers={getTeachersForCourse(course.id)}
              />
            ))}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
