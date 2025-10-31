import { AnimatePresenceWrapper, MotionDiv } from "@/components/ui/motion";
import { Course, Teacher } from "@/types";

import TeacherList from "../../list/teacher-list";

interface CourseItemBodyProps {
  course: Course;
  isExpanded: boolean;
  courseTeachers: Teacher[];
}

export default function CourseItemBody({
  course,
  isExpanded,
  courseTeachers,
}: CourseItemBodyProps) {
  return (
    <AnimatePresenceWrapper>
      {isExpanded && (
        <MotionDiv
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <TeacherList courseTeachers={courseTeachers} course={course} />
        </MotionDiv>
      )}
    </AnimatePresenceWrapper>
  );
}
