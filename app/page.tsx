import { CoursePreferences } from "@/components/course-preferences";
import { ModeToggle } from "@/components/mode-toggle";
import { SelectedCoursesTable } from "@/components/selected-courses-table";
import { Timetable } from "@/components/timetable";
import { fadeIn, MotionDiv, slideInFromBottom } from "@/components/ui/motion";

export default function Home() {
  return (
    <main className="container p-4 mx-auto">
      <MotionDiv
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-6 text-2xl font-bold text-center">FFCS Planner</h1>
      </MotionDiv>

      <MotionDiv
        {...fadeIn}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <h2 className="mb-3 text-xl font-semibold">Timetable</h2>
        <CoursePreferences />
      </MotionDiv>

      <MotionDiv
        {...slideInFromBottom}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="mb-3 text-xl font-semibold">Timetable</h2>
        <Timetable />
      </MotionDiv>

      <MotionDiv
        {...slideInFromBottom}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="mb-3 text-xl font-semibold">Selected Courses</h2>
        <SelectedCoursesTable />
      </MotionDiv>

      <ModeToggle />
    </main>
  );
}
