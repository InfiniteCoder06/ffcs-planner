"use client";

import {
  AnimatePresenceWrapper,
  fadeIn,
  MotionDiv,
  MotionTr,
  ScrollAnimation,
  slideInFromBottom,
} from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import { cn, type ColorVariant, getColorVariant } from "@/lib/utils";

import { IconButton } from "./ui/icon-button";

export function SelectedCoursesTable() {
  const { selectedTeachers, courses, toggleTeacherInTimetable } =
    useScheduleStore();

  // Calculate total credits
  const totalCredits = selectedTeachers.reduce((total, teacher) => {
    const course = courses.find((c) => c.id === teacher.course);
    return total + (course?.credits || 0);
  }, 0);

  const sortedTeachers = selectedTeachers.sort((a, b) => {
    const courseA = courses.find((c) => c.id === a.course);
    const courseB = courses.find((c) => c.id === b.course);
    return (courseA?.name || "").localeCompare(courseB?.name || "");
  });

  return (
    <ScrollAnimation animation="slideUp" threshold={0.1} duration={0.6}>
      <AnimatePresenceWrapper mode="wait">
        {sortedTeachers.length === 0 ? (
          <MotionDiv
            key="no-courses"
            className="p-4 text-center border rounded-lg text-muted-foreground"
            {...fadeIn}
            transition={{ duration: 0.3 }}
          >
            No courses selected. Add courses to your timetable to see them here.
          </MotionDiv>
        ) : (
          <MotionDiv
            key="courses-table"
            className="overflow-x-auto rounded-lg shadow-sm"
            {...slideInFromBottom}
            transition={{ duration: 0.4 }}
          >
            <table className="w-full overflow-hidden border border-collapse divide-gray-200 rounded-lg dark:divide-gray-700">
              <thead className="p-2 font-bold text-center bg-gray-100 select-none dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase text-start">
                    Course
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Faculty
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Colour
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="p-2 font-bold text-center bg-gray-100 border dark:bg-gray-800">
                <AnimatePresenceWrapper>
                  {sortedTeachers.map((teacher, index) => {
                    const course = courses.find((c) => c.id === teacher.course);
                    return (
                      <MotionTr
                        key={teacher.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: index * 0.05, // Staggered animation
                        }}
                        whileHover={{
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-start whitespace-nowrap">
                          {course?.name}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          {course?.code}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          {course?.credits}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          {teacher.name}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full m-auto",
                              getColorVariant(teacher.color as ColorVariant, [
                                "bg",
                              ]),
                            )}
                          ></div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          {teacher.venue}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <IconButton
                            icon="delete"
                            variant="error"
                            size="sm"
                            useAnimation={false}
                            onClick={() => toggleTeacherInTimetable(teacher.id)}
                          ></IconButton>
                        </td>
                      </MotionTr>
                    );
                  })}
                </AnimatePresenceWrapper>
              </tbody>
              <tfoot className="p-2 font-bold text-center bg-gray-100 border dark:bg-gray-800">
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"
                  >
                    Total Credits:
                  </td>
                  <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                    {totalCredits}
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </MotionDiv>
        )}
      </AnimatePresenceWrapper>
    </ScrollAnimation>
  );
}
