"use client";

import { memo } from "react";
import { ScrollAnimation } from "@/components/ui/motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SlotSelector } from "./slot-selection";
import { TimetableHeader } from "./ui/timetable-header";
import { TimetableBody } from "./ui/timetable-body";

import { useTimetableRenderData } from "@/hooks/useTimetableRenderData";

export const Timetable = memo(function Timetable() {
  const { cellsData } = useTimetableRenderData();

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
