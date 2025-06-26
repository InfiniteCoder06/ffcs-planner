"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import {
  Plus,
  ChevronDown,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TimetableManagement() {
  const {
    timetables,
    activeTimetableId,
    createTimetable,
    deleteTimetable,
    renameTimetable,
    setActiveTimetable,
    duplicateTimetable,
    courses,
  } = useScheduleStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTimetableName, setNewTimetableName] = useState("");
  const [renamingTimetableId, setRenamingTimetableId] = useState<string | null>(
    null,
  );

  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);

  const handleCreateTimetable = () => {
    const name = newTimetableName.trim() || undefined;
    createTimetable(name);
    setNewTimetableName("");
    setIsCreateDialogOpen(false);
  };

  const handleRename = () => {
    if (renamingTimetableId && newTimetableName.trim()) {
      renameTimetable(renamingTimetableId, newTimetableName.trim());
      setNewTimetableName("");
      setIsRenameDialogOpen(false);
      setRenamingTimetableId(null);
    }
  };

  const openRenameDialog = (timetableId: string, currentName: string) => {
    setRenamingTimetableId(timetableId);
    setNewTimetableName(currentName);
    setIsRenameDialogOpen(true);
  };

  const handleDuplicate = (timetableId: string, currentName: string) => {
    duplicateTimetable(timetableId, `${currentName} (Copy)`);
  };

  const handleDelete = (timetableId: string) => {
    if (timetables.length > 1) {
      deleteTimetable(timetableId);
    }
  };

  useEffect(() => {
    if (timetables.length == 0) {
      createTimetable(`Timetable ${timetables.length + 1}`);
    }
  }, [timetables, activeTimetableId]);

  return (
    <div className="mb-4">
      <div className="flex flex-col items-start justify-between p-4 border rounded-lg md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Active Timetable:</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled={!timetables.length}
              >
                <span className="font-medium">
                  {activeTimetable?.name || "No Timetable"}
                </span>
                <Badge variant="secondary" className="ml-2">
                  {activeTimetable?.selectedTeachers.length || 0} courses
                </Badge>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              {timetables.map((timetable) => (
                <DropdownMenuItem
                  key={timetable.id}
                  onClick={() => setActiveTimetable(timetable.id)}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer",
                    timetable.id === activeTimetableId && "bg-accent",
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{timetable.name}</span>
                      {timetable.id === activeTimetableId && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {timetable.selectedTeachers.length} courses
                      </span>
                      <span>
                        Updated:{" "}
                        {new Date(timetable.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRenameDialog(timetable.id, timetable.name);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(timetable.id, timetable.name);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {timetables.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(timetable.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 mt-4 md:mt-0">
              <Plus className="w-4 h-4" />
              New Timetable
            </Button>
          </DialogTrigger>
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
                  placeholder={`Timetable ${timetables.length + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateTimetable();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTimetable}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
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
                  value={newTimetableName}
                  onChange={(e) => setNewTimetableName(e.target.value)}
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
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>Rename</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {activeTimetable && (
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          Total available courses: {courses.length} | Selected in this
          timetable: {activeTimetable.selectedTeachers.length} | Total credits:{" "}
          {activeTimetable.selectedTeachers.reduce((sum, teacher) => {
            const course = courses.find((c) => c.id === teacher.course);
            return sum + (course?.credits || 0);
          }, 0)}
        </MotionDiv>
      )}
    </div>
  );
}
