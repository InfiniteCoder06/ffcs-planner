"use client";

import { useScheduleStore } from "@/lib/store";
import { useCallback, useMemo, useState } from "react";

import CourseItem from "@/components/course-preference/items/course-item";
import { Input } from "@/components/ui/input";
import {
  AnimatePresenceWrapper,
  fadeIn,
  MotionDiv,
  MotionUl,
} from "@/components/ui/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface CourseListProps {
  editMode: boolean;
}

export function CourseList({ editMode }: CourseListProps) {
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

      {courses.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by code or name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                editMode={editMode}
              />
            ))}
          </MotionUl>
        </AnimatePresenceWrapper>
      )}
    </div>
  );
}
