"use client";

import { Plus } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

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

interface TimetableCreationDialogProps {
  onCreateTimetable: (name?: string) => void;
  timetableCount: number;
}

export function useTimetableCreationDialog({
  onCreateTimetable,
  timetableCount,
}: TimetableCreationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTimetableName, setNewTimetableName] = useState("");

  const handleCreateTimetable = () => {
    const name = newTimetableName.trim() || undefined;
    onCreateTimetable(name);
    resetState();
    toast.success("Timetable created successfully!");
  };

  const resetState = () => {
    setNewTimetableName("");
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  // Memoize the DialogComponent to prevent unnecessary re-renders
  const DialogComponent = memo(function CreateDialogComponent() {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Timetable</DialogTitle>
            <DialogDescription>
              Create a new timetable that will share the same courses and
              teachers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="timetable-name">Timetable Name</Label>
              <Input
                id="timetable-name"
                value={newTimetableName}
                onChange={(e) => setNewTimetableName(e.target.value)}
                placeholder={`Timetable ${timetableCount + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateTimetable();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <AnimatedButton variant="outline" onClick={resetState}>
              Cancel
            </AnimatedButton>
            <AnimatedButton onClick={handleCreateTimetable} variant={"primary"}>
              Create
            </AnimatedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

  const dialog = <DialogComponent />;

  const triggerButton = (
    <AnimatedButton
      className="flex items-center gap-2"
      variant={"primary"}
      onClick={openDialog}
    >
      <Plus className="w-4 h-4" />
      New Timetable
    </AnimatedButton>
  );

  return {
    openDialog,
    dialog,
    triggerButton,
  };
}
