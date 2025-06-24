import { Timetable } from "@/components/timetable/timetable";
import { ClashVisualization } from "@/components/timetable/clash-detection/clash-visualization";
import { CoursePreferences } from "@/components/course-preference/course-preferences";
import { ModeToggle } from "@/components/mode-toggle";
import { SelectedCoursesTable } from "@/components/selected-courses-table";
import {
  MotionDiv,
  ScrollAnimation,
  Parallax,
  Stagger,
} from "@/components/ui/motion";
import { ExportSection } from "@/components/timetable/export/export-section";
import { Title } from "@/components/title";

export default function Home() {
  return (
    <main className="container p-4 mx-auto">
      <Parallax className="mb-6" speed={0.2}>
        <MotionDiv
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
        >
          <Title />
        </MotionDiv>
      </Parallax>

      <Stagger staggerDelay={0.15} animation="slideUp">
        <ScrollAnimation
          animation="fadeIn"
          duration={0.8}
          className="mb-8"
          delay={0.3}
        >
          <MotionDiv
            className="rounded-lg border bg-card p-6 shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Course Management
            </h2>
            <CoursePreferences />
          </MotionDiv>
        </ScrollAnimation>

        <ScrollAnimation
          animation="slideUp"
          duration={0.8}
          className="mb-8"
          delay={0.1}
        >
          <MotionDiv
            className="rounded-lg border bg-card p-6 shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Timetable
            </h2>
            <div className="space-y-4">
              <ScrollAnimation animation="scaleUp" delay={0.2}>
                <ClashVisualization />
              </ScrollAnimation>
              <ScrollAnimation animation="fadeIn" delay={0.3}>
                <Timetable />
              </ScrollAnimation>
            </div>
          </MotionDiv>
        </ScrollAnimation>

        <ScrollAnimation
          animation="slideUp"
          duration={0.8}
          className="mb-8"
          delay={0.2}
        >
          <MotionDiv
            className="rounded-lg border bg-card p-6 shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Selected Courses
            </h2>
            <ScrollAnimation animation="bounceIn" delay={0.1}>
              <SelectedCoursesTable />
            </ScrollAnimation>
          </MotionDiv>
        </ScrollAnimation>

        <ScrollAnimation
          animation="slideUp"
          duration={0.8}
          className="mb-8"
          delay={0.3}
        >
          <MotionDiv
            className="rounded-lg border bg-card p-6 shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Export & Share
            </h2>
            <ScrollAnimation animation="rotateIn" delay={0.1}>
              <ExportSection />
            </ScrollAnimation>
          </MotionDiv>
        </ScrollAnimation>
      </Stagger>
      <ModeToggle />
    </main>
  );
}
