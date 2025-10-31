"use client";

import { useCallback, useState } from "react";

import { MotionLi } from "@/components/ui/motion";
import { Course, Teacher } from "@/types";

import CourseItemBody from "./body";
import CourseItemHeader from "./header";

interface CourseItemProps {
  index: number;
  course: Course;
  courseTeachers: Teacher[];
}

const CourseItem = function CourseItem({
  index,
  course,
  courseTeachers,
}: CourseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <MotionLi
      className="overflow-hidden border rounded-md shadow-sm"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.05,
      }}
      whileHover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2 },
      }}
    >
      <CourseItemHeader
        course={course}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
      />

      <CourseItemBody
        course={course}
        isExpanded={isExpanded}
        courseTeachers={courseTeachers}
      />
    </MotionLi>
  );
};

export default CourseItem;
