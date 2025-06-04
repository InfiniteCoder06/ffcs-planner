import { Timetable } from "@/components//timetable/timetable";
import { ClashVisualization } from "@/components/timetable/clash-detection/clash-visualization";
import { CoursePreferences } from "@/components/course-preference/course-preferences";
import { ExportDialog } from "@/components/timetable/export/export-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { SelectedCoursesTable } from "@/components/selected-courses-table";
import { MotionDiv, Parallax, ScrollAnimation } from "@/components/ui/motion";
import { ExportSection } from "@/components/timetable/export/export-section";

export default function Home() {
  return (
    <main className="container p-4 mx-auto">
      <Parallax className="mb-6" speed={0.2}>
        <MotionDiv
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-2xl font-bold text-center">FFCS Planner</h1>
        </MotionDiv>
      </Parallax>

      <ScrollAnimation animation="fadeIn" duration={0.6} className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Course Management</h2>
        <CoursePreferences />
      </ScrollAnimation>

      <ScrollAnimation animation="slideUp" duration={0.6} className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Timetable</h2>
        <ClashVisualization />
        <Timetable />
      </ScrollAnimation>

      <ScrollAnimation animation="slideUp" duration={0.6} className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Selected Courses</h2>
        <SelectedCoursesTable />
      </ScrollAnimation>

      <ScrollAnimation animation="slideUp" duration={0.6} className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Export</h2>
        <ExportSection />
      </ScrollAnimation>

      <ModeToggle />
    </main>
  );
}
