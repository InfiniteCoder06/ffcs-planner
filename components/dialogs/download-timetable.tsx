"use client";

import { useEffect, useState, useCallback } from "react";
import { DownloadIcon, Loader, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { MotionDiv } from "../ui/motion";

const generateDefaultFilename = () => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0];
  const timePart = now.toLocaleTimeString().replace(/:/g, ":");
  return `timetable-${datePart}-${timePart}`;
};

export function DownloadTimetableDialog({ disabled = false }) {
  const { getExportData } = useScheduleStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(generateDefaultFilename());
    }
  }, [open]);

  const handleDownload = useCallback(() => {
    if (!name.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const data = getExportData();
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.trim()}.ffcsplanner`;
      a.click();

      setTimeout(() => URL.revokeObjectURL(url), 100);

      setIsLoading(false);
      setOpen(false);
    } catch (err) {
      console.error("Error while downloading:", err);
      setError("Failed to save timetable. Please try again.");
      setIsLoading(false);
    }
  }, [getExportData, name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Save TT
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>Save Timetable</DialogTitle>
            <DialogDescription>
              Export your timetable to use again.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="grid gap-2"
            >
              <Label htmlFor="name">File Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Timetable"
              />
            </MotionDiv>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              variant={error ? "error" : "default"}
              className="flex items-center gap-2"
              onClick={handleDownload}
              disabled={!name.trim() || isLoading}
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {error && !isLoading && <TriangleAlert className="w-4 h-4" />}
              {!isLoading && !error && <DownloadIcon className="w-4 h-4" />}
              {isLoading ? "Saving..." : error ? "Retry" : "Save"}
            </Button>
          </DialogFooter>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
