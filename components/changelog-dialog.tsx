"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { AnimatedButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import changelogData from "@/lib/changelog.json";

import { MotionDiv } from "./ui/motion";

interface ChangelogDialogProps {
  currentAppVersion: string | undefined;
}

export function ChangelogDialog({ currentAppVersion }: ChangelogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeenVersion, setLastSeenVersion] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("ffcs_planner_version");
  });

  const handleUpdate = useEffectEvent(() => {
    if (!currentAppVersion) return;
    setIsOpen(true);
  });

  useEffect(() => {
    if (!currentAppVersion) return;
    if (lastSeenVersion !== currentAppVersion) {
      handleUpdate();
    }
  }, [currentAppVersion, lastSeenVersion]);

  const handleDialogOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open && currentAppVersion) {
      setLastSeenVersion(currentAppVersion);
      localStorage.setItem("ffcs_planner_version", currentAppVersion);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger className="" asChild>
        <AnimatedButton
          variant="primary"
          className={currentAppVersion == undefined ? "" : "hidden"}
        >
          View Changelog
        </AnimatedButton>
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

          <ScrollArea className="max-h-[60vh] py-4 pr-4 overflow-hidden overflow-y-auto">
            <div className="space-y-4">
              {(() => {
                const currentIndex = changelogData.findIndex(
                  (entry) => entry.version === lastSeenVersion,
                );
                const filteredData =
                  currentIndex !== -1 && currentAppVersion
                    ? changelogData.slice(0, currentIndex + 1)
                    : changelogData;
                return filteredData.map((versionEntry) => (
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
                ));
              })()}
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4">
            <AnimatedButton
              onClick={() => handleDialogOpen(false)}
              variant="primary"
            >
              Got It!
            </AnimatedButton>
          </div>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
