"use client";

import { ClashDetails } from "@/components/timetable/clash-detection/clash-details";
import { Button } from "@/components/ui/button";
import { AnimatePresenceWrapper, MotionDiv } from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function ClashVisualization() {
  const { selectedTeachers, getAllClashes } = useScheduleStore();
  const [showDetails, setShowDetails] = useState(false);
  const [animateAlert, setAnimateAlert] = useState(false);

  // Get all clashes in the current timetable
  const clashes = useMemo(
    () => getAllClashes(),
    [getAllClashes, selectedTeachers],
  );

  // Count of clashes
  const clashCount = useMemo(() => clashes.length, [clashes]);

  // Trigger animation when clash count changes
  useEffect(() => {
    if (clashCount > 0) {
      setAnimateAlert(true);
      const timer = setTimeout(() => setAnimateAlert(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [clashCount]);

  return (
    <AnimatePresenceWrapper mode="sync">
      {selectedTeachers.length > 0 && (
        <div className="mb-4">
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-4 rounded-lg border flex items-center justify-between",
              clashCount > 0
                ? "bg-reda-ui border-reda-dim text-reda-dim"
                : "bg-greena-ui border-greena-dim text-greena-dim",
            )}
          >
            <div className="flex items-center gap-3">
              <MotionDiv
                animate={
                  animateAlert && clashCount > 0
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [-5, 0, 5, 0],
                        transition: { duration: 0.5, ease: "easeInOut" },
                      }
                    : {}
                }
              >
                {clashCount > 0 ? (
                  <AlertTriangle className={cn("h-6 w-6")} />
                ) : (
                  <CheckCircle2 className={cn("h-6 w-6")} />
                )}
              </MotionDiv>
              <div>
                <h3 className={cn("font-medium")}>
                  {clashCount > 0 ? "Slot Clashes Detected" : "No Slot Clashes"}
                </h3>
                <p className={cn("text-sm")}>
                  {clashCount > 0
                    ? `Found ${clashCount} clash${clashCount > 1 ? "es" : ""} in your timetable`
                    : "Your timetable is clash-free"}
                </p>
              </div>
            </div>
            {clashCount > 0 && (
              <Button
                variant="errorSolid"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
            )}
          </MotionDiv>

          <AnimatePresenceWrapper mode="sync">
            {showDetails && clashCount > 0 && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
                layout
              >
                <ClashDetails clashes={clashes} />
              </MotionDiv>
            )}
          </AnimatePresenceWrapper>
        </div>
      )}
    </AnimatePresenceWrapper>
  );
}
