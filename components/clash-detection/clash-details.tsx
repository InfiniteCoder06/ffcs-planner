"use client";

import { useScheduleStore, type ClashInfo } from "@/lib/store";
import { MotionDiv, MotionLi } from "../ui/motion";
import { useMemo } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { cn, getColorVariant, TailwindColor } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface ClashDetailsProps {
  clashes: ClashInfo[];
}

export function ClashDetails({ clashes }: ClashDetailsProps) {
  const { courses } = useScheduleStore();

  // Group clashes by slot for better visualization
  const groupedClashes = useMemo(() => {
    const grouped: Record<string, ClashInfo[]> = {};

    clashes.forEach((clash) => {
      if (!grouped[clash.slot]) {
        grouped[clash.slot] = [];
      }
      grouped[clash.slot].push(clash);
    });

    return grouped;
  }, [clashes]);

  return (
    <div
      key={"clash-details"}
      className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900"
    >
      <div
        className={cn(
          "p-3 border-b",
          getColorVariant("red", ["bgLight", "border"]),
        )}
      >
        <h4
          className={cn(
            "font-medium flex items-center gap-2",
            getColorVariant("red", ["text"]),
          )}
        >
          <AlertCircle className="h-4 w-4" />
          Clash Details
        </h4>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="p-3">
          {Object.entries(groupedClashes).map(
            ([slot, slotClashes], groupIndex) => (
              <MotionDiv
                key={slot + groupIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                className="mb-4 last:mb-0"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 mb-2",
                    getColorVariant("red", ["text"]),
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <h5 className="font-medium">
                    Slot {slot} ({slotClashes.length} clash
                    {slotClashes.length > 1 ? "es" : ""})
                  </h5>
                </div>

                <ul className="space-y-2 pl-6">
                  {slotClashes.map((clash, index) => {
                    const course1 = courses.find(
                      (c) => c.id === clash.teacher1.course,
                    );
                    const course2 = courses.find(
                      (c) => c.id === clash.teacher2.course,
                    );

                    return (
                      <MotionLi
                        key={`${slot}-${clash.teacher1.id}-${clash.teacher2.id}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05 + groupIndex * 0.1,
                        }}
                        className="text-sm"
                      >
                        <div
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-md",
                            getColorVariant("red", ["bgLight"]),
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Badge
                              className={cn(
                                "rounded-full",
                                getColorVariant(
                                  clash.teacher1.color as TailwindColor,
                                  ["bg", "text"],
                                ),
                              )}
                            >
                              {course1?.code || "Unknown"}
                            </Badge>
                            <span className="text-gray-700 dark:text-gray-300">
                              {clash.teacher1.name}
                            </span>
                          </div>

                          <div className="flex items-center justify-center">
                            <Badge
                              variant="outline"
                              className="bg-white dark:bg-gray-800"
                            >
                              clashes with
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 flex-1">
                            <Badge
                              className={cn(
                                "rounded-full",
                                getColorVariant(
                                  clash.teacher2.color as TailwindColor,
                                  ["bg", "text"],
                                ),
                              )}
                            >
                              {course2?.code || "Unknown"}
                            </Badge>
                            <span className="text-gray-700 dark:text-gray-300">
                              {clash.teacher2.name}
                            </span>
                          </div>
                        </div>
                      </MotionLi>
                    );
                  })}
                </ul>
              </MotionDiv>
            ),
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
