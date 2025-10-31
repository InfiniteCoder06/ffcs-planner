import EmptyState from "@/components/empty-state";
import { AnimatePresenceWrapper, MotionUl } from "@/components/ui/motion";
import {
  useFilteredCourses,
  useTeachersForCourse,
} from "@/src/hooks/useFilteredCourses";
import { Course, Teacher } from "@/types";

import CourseItem from "../../items/course-item/course-item";

interface Props {
  courses: Course[];
  teachers: Teacher[];
  sortBy: "code" | "name";
  searchQuery: string;
}

export function CourseListContent({
  courses,
  teachers,
  sortBy,
  searchQuery,
}: Props) {
  const filteredCourses = useFilteredCourses(courses, searchQuery, sortBy);
  const getTeachersForCourse = useTeachersForCourse(teachers);

  if (courses.length === 0) {
    return (
      <EmptyState
        text="No courses added yet. Add your first course!"
        animationKey="no-courses"
      />
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <EmptyState
        text="No courses match your search."
        animationKey="no-results"
      />
    );
  }

  return (
    <AnimatePresenceWrapper>
      <MotionUl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-3"
        layout
      >
        {filteredCourses.map((course, index) => (
          <CourseItem
            key={course.id}
            index={index}
            course={course}
            courseTeachers={getTeachersForCourse(course.id)}
          />
        ))}
      </MotionUl>
    </AnimatePresenceWrapper>
  );
}
