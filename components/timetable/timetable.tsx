"use client";

import { memo, useEffect } from "react";

import { ScrollAnimation } from "@/components/ui/motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTimetableRenderData } from "@/hooks/useTimetableRenderData";

import { SlotSelector } from "./slot-selection";
import { TimetableBody } from "./ui/timetable-body";
import { TimetableHeader } from "./ui/timetable-header";

export const Timetable = memo(function Timetable() {
  const { cellsData } = useTimetableRenderData();

  useEffect(() => {
    console.debug("Timetable cells data prepared:", cellsData);
  }, [cellsData]);

  return (
    <TooltipProvider>
      <SlotSelector />
      <ScrollAnimation animation="fadeIn" duration={0.8}>
        <div className="overflow-x-auto select-none">
          <table className="w-full border-collapse rounded-lg shadow-sm border divide-gray-200 dark:divide-gray-700 overflow-hidden">
            <TimetableHeader />
            <TimetableBody cellsData={cellsData} />
          </table>
        </div>
      </ScrollAnimation>
    </TooltipProvider>
  );
});
