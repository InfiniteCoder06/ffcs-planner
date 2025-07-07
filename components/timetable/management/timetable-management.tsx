"use client";

import { memo } from "react";
import { toast } from "sonner";

import { useScheduleStore } from "@/lib/store";

import { useTimetableCreationDialog } from "./timetable-creation-dialog";
import { useTimetableRenameDialog } from "./timetable-rename-dialog";
import { TimetableSelector } from "./timetable-selector";
import { TimetableStats } from "./timetable-stats";

export const TimetableManagement = memo(function TimetableManagement() {
  const {
    timetables,
    activeTimetableId,
    createTimetable,
    deleteTimetable,
    renameTimetable,
    setActiveTimetable,
    duplicateTimetable,
  } = useScheduleStore();

  const { openDialog, dialog: renameDialog } = useTimetableRenameDialog({
    onRename: (timetableId, newName) => {
      renameTimetable(timetableId, newName);
      toast.success(`Timetable renamed to "${newName}"`);
    },
  });

  const { dialog: createDialog, triggerButton: createButton } =
    useTimetableCreationDialog({
      onCreateTimetable: createTimetable,
      timetableCount: timetables.length,
    });

  const handleDuplicate = (timetableId: string, currentName: string) => {
    duplicateTimetable(timetableId, `${currentName} (Copy)`);
  };

  const handleDelete = (timetableId: string) => {
    if (timetables.length > 1) {
      deleteTimetable(timetableId);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col items-start justify-between p-4 border rounded-lg md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <TimetableSelector
            timetables={timetables}
            activeTimetableId={activeTimetableId}
            setActiveTimetable={setActiveTimetable}
            onRename={openDialog}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </div>

        {createButton}

        {renameDialog}
        {createDialog}
      </div>

      {activeTimetableId && <TimetableStats timetableId={activeTimetableId} />}
    </div>
  );
});
