"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotionDiv } from "@/components/ui/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Teacher, useScheduleStore } from "@/lib/store";
import { cn, colors } from "@/lib/utils";
import { DialogButtonProps } from "@/types";

interface AddTeacherDialogProps extends DialogButtonProps {
  teacherToEdit: Teacher | null;
}

export function AddTeacherDialog({
  teacherToEdit,
  buttonVariant = "default",
  buttonSize = "sm",
  buttonIcon = "add",
  buttonText = "Add Teacher",
}: AddTeacherDialogProps) {
  const { addTeacher, editTeacher, courses } = useScheduleStore();

  const [open, setOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [selectedColor, setSelectedColor] = useState("orange");
  const [slots, setSlots] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Sync form when dialog is opened
  useEffect(() => {
    if (teacherToEdit) {
      setTeacherName(teacherToEdit.name);
      setSelectedColor(teacherToEdit.color);
      setSlots(teacherToEdit.slots.join("+"));
      setVenue(teacherToEdit.venue);
      setSelectedCourse(teacherToEdit.course);
    } else {
      setTeacherName("");
      setSelectedColor("orange");
      setSlots("");
      setVenue("");
      setSelectedCourse("");
    }
  }, [teacherToEdit, open]);

  const handleAddTeacher = () => {
    const cleanedName = teacherName.trim();
    const cleanedVenue = venue.trim();
    const slotArray = slots
      .split("+")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (cleanedName && slotArray.length > 0 && selectedCourse) {
      const teacherData = {
        name: cleanedName,
        color: selectedColor,
        slots: slotArray,
        venue: cleanedVenue,
        course: selectedCourse,
      };

      if (teacherToEdit) {
        editTeacher(teacherToEdit.id, teacherData);
      } else {
        addTeacher(teacherData);
      }

      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {buttonIcon === "add" && <PlusIcon className="w-4 h-4" />}
          {buttonIcon === "edit" && <PencilIcon className="w-4 h-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>
              {teacherToEdit ? "Edit Teacher" : "Add Teacher"}
            </DialogTitle>
            <DialogDescription>
              {teacherToEdit
                ? "Edit the teacher details below:"
                : "Enter the teacher details below to add them to your FFCS planner."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="grid gap-2"
            >
              <Label>Course</Label>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={courses.length === 0}
              >
                <SelectTrigger className="flex-1">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid gap-2"
              >
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Dr. Smith"
                />
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid gap-2"
              >
                <Label htmlFor="color">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem
                        key={color.value}
                        value={color.value}
                        className={cn(
                          "my-2",
                          `bg-${color.value}-solid text-white`,
                        )}
                      >
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </MotionDiv>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="grid gap-2"
              >
                <Label htmlFor="slots">Slots</Label>
                <Input
                  id="slots"
                  value={slots}
                  onChange={(e) => setSlots(e.target.value)}
                  placeholder="e.g. A1+TA1"
                />
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="grid gap-2"
              >
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Room 101"
                />
              </MotionDiv>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="success"
              onClick={handleAddTeacher}
              disabled={
                !teacherName.trim() ||
                !slots.trim() ||
                !selectedCourse ||
                courses.length === 0
              }
            >
              {teacherToEdit ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
