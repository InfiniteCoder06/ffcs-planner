"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MotionDiv } from "./ui/motion";
import changelogData from "@/lib/changelog.json";

interface ChangelogDialogProps {
  currentAppVersion: string | undefined;
}

export function ChangelogDialog({ currentAppVersion }: ChangelogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentAppVersion) return;
    const lastSeenVersion = localStorage.getItem("ffcs_planner_version");
    if (lastSeenVersion !== currentAppVersion) {
      setIsOpen(true);
      localStorage.setItem("ffcs_planner_version", currentAppVersion);
    }
  }, [currentAppVersion]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="" asChild>
        <Button className={currentAppVersion == undefined ? "" : "hidden"}>
          View Changelog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>What&apos;s New in FFCS Planner?</DialogTitle>
            <DialogDescription>
              Version {currentAppVersion} - Check out the latest improvements!
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[80vh] py-4 pr-4 overflow-hidden overflow-y-auto">
            <div className="space-y-4">
              {changelogData.map((versionEntry) => (
                <div key={versionEntry.version}>
                  <h3 className="font-semibold text-lg mb-2">
                    Version {versionEntry.version}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {versionEntry.entries.map((entry, index) => (
                      <li key={index}>
                        <strong>{entry.type}:</strong> {entry.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsOpen(false)}>Got It!</Button>
          </div>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
