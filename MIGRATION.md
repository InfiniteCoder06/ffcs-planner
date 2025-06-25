# Migration System for Multiple Timetables

This document explains the migration system implemented to transition from the old single-timetable format to the new multiple-timetable system.

## Overview

The FFCS Planner has been updated to support multiple timetables while maintaining the same pool of courses and teachers. This migration system ensures that existing user data is preserved and automatically converted to the new format.

## Migration Features

### Automatic Migration

- **Auto-detection**: The system automatically detects old data format when the app loads
- **Seamless transition**: Users don't lose any existing course selections or teacher data
- **Version tracking**: Prevents duplicate migrations using a version field

### Manual Migration

- **Migration UI**: A user-friendly component appears when legacy data is detected
- **One-click migration**: Users can manually trigger migration if automatic migration fails
- **Testing utilities**: Development mode includes migration testing tools

## Technical Implementation

### Store Structure Changes

**Old Format:**

```typescript
{
  courses: Course[],
  teachers: Teacher[],
  selectedTeachers: Teacher[],  // Global selection
  selectedSlots: string[]       // Global selection
}
```

**New Format:**

```typescript
{
  courses: Course[],           // Shared across timetables
  teachers: Teacher[],         // Shared across timetables
  timetables: Timetable[],     // Multiple timetables
  activeTimetableId: string,   // Currently selected timetable
  version: number              // For migration tracking
}
```

### Migration Process

1. **Detection**: Check if `version` < 2 or legacy fields exist
2. **Data Preservation**: Extract all existing courses, teachers, and selections
3. **Timetable Creation**: Create a default timetable with legacy selections
4. **State Update**: Update store with new structure and version 2
5. **Cleanup**: Remove legacy fields from persisted storage

### Key Components

#### `migrateFromLegacyData()` Function

- Core migration logic in the Zustand store
- Handles multiple migration scenarios
- Preserves all user data during transition

#### `MigrationHelper` Component

- UI component that appears when migration is needed
- Provides manual migration trigger
- Shows migration status and feedback

#### `migration-test.ts` Utility

- Testing utilities for developers
- Simulates legacy data scenarios
- Validates migration correctness

## Migration Scenarios

### Scenario 1: Legacy Data with Selections

```typescript
// Before migration
{
  courses: [...],
  teachers: [...],
  selectedTeachers: [teacher1, teacher2],
  selectedSlots: ["A1", "B1"],
  version: undefined
}

// After migration
{
  courses: [...],
  teachers: [...],
  timetables: [{
    id: "uuid",
    name: "My Timetable",
    selectedTeachers: [teacher1, teacher2],
    selectedSlots: ["A1", "B1"]
  }],
  activeTimetableId: "uuid",
  version: 2
}
```

### Scenario 2: Fresh Installation

```typescript
// New users get the latest format immediately
{
  courses: [],
  teachers: [],
  timetables: [],
  activeTimetableId: null,
  version: 2
}
```

### Scenario 3: Data with No Selections

```typescript
// Before migration (has courses/teachers but no selections)
{
  courses: [...],
  teachers: [...],
  selectedTeachers: [],
  selectedSlots: [],
  version: undefined
}

// After migration (creates empty default timetable)
{
  courses: [...],
  teachers: [...],
  timetables: [{
    id: "uuid",
    name: "My Timetable",
    selectedTeachers: [],
    selectedSlots: []
  }],
  activeTimetableId: "uuid",
  version: 2
}
```

## Benefits of the New System

### For Users

- **Multiple timetables**: Create different timetable combinations (e.g., Plan A, Plan B)
- **Data preservation**: No loss of existing course and teacher data
- **Seamless experience**: Migration happens automatically and transparently

### For Developers

- **Backward compatibility**: System gracefully handles old data formats
- **Testing tools**: Comprehensive migration testing utilities
- **Version tracking**: Prevents migration conflicts and duplicate runs

## Development and Testing

### Testing Migration

```typescript
// In browser console (development mode)
import { runMigrationTest } from "@/lib/migration-test";
runMigrationTest();
```

### Manual Migration Trigger

```typescript
// Manually trigger migration
const store = useScheduleStore.getState();
store.migrateFromLegacyData();
```

### Migration Component

The `MigrationHelper` component automatically appears when:

- Legacy data is detected
- Version is less than 2
- No existing timetables are found with course/teacher data

## Future Considerations

### Import/Export Compatibility

- **Legacy import**: System accepts both old and new export formats
- **Current export**: Always exports in new format with all timetables
- **File compatibility**: Maintains backward compatibility for shared files

### Performance

- **One-time operation**: Migration runs only once per user
- **Efficient detection**: Quick checks prevent unnecessary processing
- **Minimal overhead**: No impact on users with current data format

## Troubleshooting

### Common Issues

1. **Migration not triggered**
   - Check browser console for migration logs
   - Verify data format in localStorage
   - Use manual migration button

2. **Data loss concerns**
   - Migration preserves all original data
   - Creates backup in browser console logs
   - Test migration validates data integrity

3. **Multiple migrations**
   - Version tracking prevents duplicate runs
   - Safe to run migration multiple times
   - No data corruption from re-running

### Support

For issues with migration, check:

1. Browser console logs
2. Migration test results
3. Store state before/after migration
4. Component visibility in UI
