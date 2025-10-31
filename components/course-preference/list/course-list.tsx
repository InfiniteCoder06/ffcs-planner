"use client";

import { useState } from "react";

import { useScheduleStore } from "@/lib/store";

import { CourseListContent } from "./course-list/content";
import { CourseFilters } from "./course-list/filters";
import { CourseListHeader } from "./course-list/header";

export function CourseList() {
  const { courses, teachers } = useScheduleStore();
  const [sortBy, setSortBy] = useState<"code" | "name">("code");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <CourseListHeader
        totalCourses={courses.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {courses.length > 0 && (
        <CourseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <CourseListContent
        courses={courses}
        teachers={teachers}
        sortBy={sortBy}
        searchQuery={searchQuery}
      />
    </div>
  );
}
