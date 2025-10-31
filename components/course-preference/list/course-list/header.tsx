import { CourseSortMenu } from "../../ui/sort-menu";

interface CourseListHeaderProps {
  totalCourses: number;
  sortBy: "code" | "name";
  onSortChange: (value: "code" | "name") => void;
}

export function CourseListHeader({
  totalCourses,
  sortBy,
  onSortChange,
}: CourseListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Your Courses</h3>
      {totalCourses > 1 && (
        <CourseSortMenu
          value={sortBy}
          onChange={(v) => onSortChange(v as "code" | "name")}
        />
      )}
    </div>
  );
}
