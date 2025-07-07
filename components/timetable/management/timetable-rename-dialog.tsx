"use client";

import { memo, useState } from "react";

import { AnimatedButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimetableRenameDialogProps {
  onRename: (timetableId: string, newName: string) => void;
}

export function useTimetableRenameDialog({
  onRename,
}: TimetableRenameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timetableId, setTimetableId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleRename = () => {
    if (timetableId && newName.trim()) {
      onRename(timetableId, newName.trim());
      resetState();
    }
  };

  const resetState = () => {
    setNewName("");
    setIsOpen(false);
    setTimetableId(null);
  };

  const openDialog = (id: string, currentName: string) => {
    setTimetableId(id);
    setNewName(currentName);
    setIsOpen(true);
  };

  // Memoize the DialogComponent to prevent unnecessary re-renders
  const DialogComponent = memo(function RenameDialogComponent() {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Timetable</DialogTitle>
            <DialogDescription>
              Enter a new name for this timetable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-timetable">Timetable Name</Label>
              <Input
                id="rename-timetable"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter timetable name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <AnimatedButton variant="outline" onClick={resetState}>
              Cancel
            </AnimatedButton>
            <AnimatedButton onClick={handleRename} variant={"primary"}>
              Rename
            </AnimatedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

  const dialog = <DialogComponent />;

  return {
    openDialog,
    dialog,
  };
}
