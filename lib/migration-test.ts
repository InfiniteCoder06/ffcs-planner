/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration Testing Utility
 *
 * This utility helps test the migration from the old single-timetable format
 * to the new multiple-timetable format.
 *
 * Usage:
 * 1. Import this utility
 * 2. Call testMigration() to simulate migration scenarios
 */

import { useScheduleStore } from "@/lib/store";
import type { Course, Teacher } from "@/types";

export interface LegacyStoreData {
  courses: Course[];
  teachers: Teacher[];
  selectedTeachers: Teacher[];
  selectedSlots: string[];
}

export function createMockLegacyData(): LegacyStoreData {
  const mockCourses: Course[] = [
    {
      id: "course-1",
      name: "Computer Networks",
      code: "CSE4004",
      credits: 3,
    },
    {
      id: "course-2",
      name: "Database Management Systems",
      code: "CSE4006",
      credits: 4,
    },
  ];

  const mockTeachers: Teacher[] = [
    {
      id: "teacher-1",
      name: "Dr. Smith",
      color: "blue",
      slots: ["A1", "A2"],
      venue: "SJT-101",
      course: "course-1",
    },
    {
      id: "teacher-2",
      name: "Prof. Johnson",
      color: "green",
      slots: ["B1", "B2"],
      venue: "SJT-102",
      course: "course-2",
    },
  ];

  return {
    courses: mockCourses,
    teachers: mockTeachers,
    selectedTeachers: [mockTeachers[0]], // Only first teacher selected
    selectedSlots: ["A1", "A2"],
  };
}

export function simulateLegacyStore(legacyData: LegacyStoreData) {
  const store = useScheduleStore.getState();

  // Clear current data
  store.clearAll();

  // Simulate legacy data by directly setting the store state
  // This mimics what would happen when loading old persisted data
  useScheduleStore.setState({
    courses: legacyData.courses,
    teachers: legacyData.teachers,
    // Simulate legacy fields that shouldn't exist in new format
    selectedTeachers: legacyData.selectedTeachers,
    selectedSlots: legacyData.selectedSlots,
    timetables: [],
    activeTimetableId: null,
    version: undefined, // No version means legacy data
  } as any);
}

export function testMigration(): {
  success: boolean;
  message: string;
  details?: any;
} {
  try {
    // 1. Create mock legacy data
    const legacyData = createMockLegacyData();
    console.log("Created legacy data:", legacyData);

    // 2. Simulate legacy store state
    simulateLegacyStore(legacyData);
    console.log("Simulated legacy store state");

    // 3. Run migration
    const store = useScheduleStore.getState();
    store.migrateFromLegacyData();
    console.log("Migration completed");

    // 4. Verify migration results
    const postMigrationState = useScheduleStore.getState();

    // Check that version is updated
    if (postMigrationState.version !== 2) {
      return {
        success: false,
        message: "Version not updated correctly",
        details: { version: postMigrationState.version },
      };
    }

    // Check that timetables were created
    if (postMigrationState.timetables.length !== 1) {
      return {
        success: false,
        message: "Timetable not created",
        details: { timetables: postMigrationState.timetables },
      };
    }

    // Check that active timetable is set
    if (!postMigrationState.activeTimetableId) {
      return {
        success: false,
        message: "Active timetable not set",
        details: { activeTimetableId: postMigrationState.activeTimetableId },
      };
    }

    // Check that selected teachers are preserved
    const activeTimetable = postMigrationState.timetables[0];
    if (
      activeTimetable.selectedTeachers.length !==
      legacyData.selectedTeachers.length
    ) {
      return {
        success: false,
        message: "Selected teachers not preserved",
        details: {
          expected: legacyData.selectedTeachers.length,
          actual: activeTimetable.selectedTeachers.length,
        },
      };
    }

    // Check that selected slots are preserved
    if (
      activeTimetable.selectedSlots.length !== legacyData.selectedSlots.length
    ) {
      return {
        success: false,
        message: "Selected slots not preserved",
        details: {
          expected: legacyData.selectedSlots.length,
          actual: activeTimetable.selectedSlots.length,
        },
      };
    }

    // Check that courses and teachers are preserved
    if (postMigrationState.courses.length !== legacyData.courses.length) {
      return {
        success: false,
        message: "Courses not preserved",
        details: {
          expected: legacyData.courses.length,
          actual: postMigrationState.courses.length,
        },
      };
    }

    if (postMigrationState.teachers.length !== legacyData.teachers.length) {
      return {
        success: false,
        message: "Teachers not preserved",
        details: {
          expected: legacyData.teachers.length,
          actual: postMigrationState.teachers.length,
        },
      };
    }

    return {
      success: true,
      message: "Migration test passed successfully!",
      details: {
        migratedTimetable: activeTimetable,
        totalCourses: postMigrationState.courses.length,
        totalTeachers: postMigrationState.teachers.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Migration test failed with error",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// Console helper for easy testing
export function runMigrationTest() {
  console.log("🧪 Running migration test...");
  const result = testMigration();

  if (result.success) {
    console.log("✅", result.message);
    console.log("📊 Details:", result.details);
  } else {
    console.error("❌", result.message);
    console.error("🔍 Details:", result.details);
  }

  return result;
}
