import { Teacher, useScheduleStore } from "@/lib/store";

interface CourseRowProps {
  teacher: Teacher;
}

export function CourseRow({ teacher }: CourseRowProps) {
  const { courses } = useScheduleStore();
  const course = courses.find((c) => c.id === teacher.course);

  return (
    <tr>
      <td className="p-2 border">{course?.code}</td>
      <td className="p-2 border">{course?.name}</td>
      <td className="p-2 text-center border">{course?.credits}</td>
      <td className="p-2 border">{teacher.name}</td>
      <td className="p-2 border">{teacher.venue}</td>
      <td className="p-2 border">{teacher.slots.join(", ")}</td>
    </tr>
  );
}
