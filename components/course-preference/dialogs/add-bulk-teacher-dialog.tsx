"use client";

import { useEffect, useState, useCallback } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScheduleStore } from "@/lib/store";
import { colors } from "@/lib/utils";
import type { DialogButtonProps } from "@/types";
import { toast } from "sonner";
import { MotionDiv } from "@/components/ui/motion";
import { mergeSlots } from "@/lib/slots";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type BulkAddTeachersDialogProps = DialogButtonProps;

export function BulkAddTeachersDialog({
  buttonVariant = "default",
  buttonSize = "sm",
  buttonText = "Bulk Add Teachers",
  buttonIcon = "add",
  disabled = false,
}: BulkAddTeachersDialogProps) {
  const { addTeacher, courses } = useScheduleStore();

  const [open, setOpen] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [merge, setMerge] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [colorIndex, setColorIndex] = useState(0);

  // Reset form when dialog is opened
  useEffect(() => {
    if (!open) {
      setRawInput("");
      setSelectedCourse("");
      setColorIndex(0);
    }
  }, [open]);

  const handleAddTeachers = useCallback(() => {
    if (!rawInput.trim() || !selectedCourse) {
      toast.error("Missing Information", {
        description: "Please paste data and select a course.",
      });
      return;
    }

    let lines: string[] = [];
    if (merge) {
      lines = mergeSlots(
        rawInput.split("\n").filter((line) => line.trim() !== ""),
      );
    } else {
      lines = rawInput.split("\n").filter((line) => line.trim() !== "");
    }

    if (lines.length === 0) {
      toast.error("No Data Found", {
        description: "Please paste valid teacher data.",
      });
      return;
    }

    let addedCount = 0;
    let errorCount = 0;

    lines.forEach((line) => {
      // Attempt to split by tab first, then by multiple spaces
      const parts = line.split("\t").map((p) => p.trim());
      let slotDetail = "";
      let venue = "";
      let faculty = "";

      if (parts.length >= 3) {
        slotDetail = parts[0];
        venue = parts[1];
        faculty = parts[2];
      } else {
        // Fallback to splitting by multiple spaces if tab split fails
        const spaceParts = line.split(/\s{2,}/).map((p) => p.trim());
        if (spaceParts.length >= 3) {
          slotDetail = spaceParts[0];
          venue = spaceParts[1];
          faculty = spaceParts[2];
        } else {
          errorCount++;
          return; // Skip this line if parsing fails
        }
      }

      const slotArray = slotDetail
        .split("+")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (faculty && slotArray.length > 0) {
        const teacherData = {
          name: faculty,
          color: colors[colorIndex % colors.length].value, // Cycle through colors
          slots: slotArray,
          venue: venue,
          course: selectedCourse,
        };
        addTeacher(teacherData);
        setColorIndex((prev) => prev + 1); // Increment for next teacher
        addedCount++;
      } else {
        errorCount++;
      }
    });

    if (addedCount > 0) {
      toast.success("Teachers Added", {
        description: `${addedCount} teacher(s) added successfully.`,
      });
    }
    if (errorCount > 0) {
      toast.warning("Partial Success", {
        description: `${errorCount} line(s) could not be parsed.`,
      });
    }

    setOpen(false);
  }, [rawInput, selectedCourse, colorIndex, addTeacher]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} disabled={disabled}>
          {buttonIcon === "add" && <PlusIcon className="w-4 h-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>Bulk Add Teachers</DialogTitle>
            <DialogDescription>
              1. Login to VTOP <br /> 2. Click Academics &gt; Course
              Registration Allocation <br /> 3. Copy the data from the table{" "}
              <br /> 4. Paste it below and associate with a course
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="grid gap-2"
            >
              <Label htmlFor="course">Associate with Course</Label>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={courses.length === 0}
              >
                <SelectTrigger className="flex-1 w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {courses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No courses available. Please add a course first.
                </p>
              )}
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid gap-2"
            >
              <Label htmlFor="rawInput">Pasted Data</Label>
              <Textarea
                id="rawInput"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder={`Example:\nC2+TC2+TCC2\tPRP134\tMANIMARAN A\tTH\nC1+TC1+TCC1\tPRP267\tSARAVANARAJAN M C\tTH`}
                rows={8}
                className="font-mono text-xs max-h-[300px]"
              />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <Switch
                id="useMerge"
                checked={merge}
                onCheckedChange={setMerge}
              />
              <Label htmlFor="useMerge">Embedded Course?</Label>
            </MotionDiv>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="success"
              onClick={handleAddTeachers}
              disabled={
                !rawInput.trim() || !selectedCourse || courses.length === 0
              }
            >
              Add Teachers
            </Button>
          </DialogFooter>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
