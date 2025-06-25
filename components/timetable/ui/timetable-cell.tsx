import { memo, useCallback, useMemo } from "react";
import { MotionDiv, MotionTd } from "@/components/ui/motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { manualSlotSelectionStore, useScheduleStore } from "@/lib/store";
import { useClashDetails } from "@/hooks/useClashDetails";
import { TimetableCache } from "@/types";

interface TimetableCellProps {
  slot: string[];
  slotIndex: number;
  dayIndex: number;
  cache: TimetableCache;
}

export const TimetableCell = memo(function TimetableCell({
  slot,
  slotIndex,
  dayIndex,
  cache,
}: TimetableCellProps) {
  const { manualSelectedSlots, toggleSlot } = manualSlotSelectionStore();
  const { getAllClashes } = useScheduleStore();
  const getClashDetails = useClashDetails();

  const key = slot.join("/");

  const allClashes = useMemo(() => getAllClashes(), [getAllClashes]);

  // Check for clashes using the store's clash detection for each slot in this cell
  // but exclude clashes between slots within the same cell
  // const clashes = slot.flatMap((s) =>
  //   getSlotClashes(s).filter((clash) => {
  //     // Only show clash if the clashing slots are NOT in the current cell
  //     return !slot.includes(clash.slot);
  //   }),
  // );
  // const isClash = clashes.length > 0;

  const selected = slot.some((s) => manualSelectedSlots.includes(s));
  const clashDetails = getClashDetails(slot);

  const handleClick = useCallback(() => {
    slot.forEach(toggleSlot);
  }, [slot, toggleSlot]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <MotionTd
          className={cn(
            "p-2 text-xs text-center border h-24 max-h-24 overflow-hidden transition-colors duration-200 dark:border-gray-700 hover:cursor-pointer",
            allClashes.length > 0 && clashDetails
              ? "bg-red-solid text-white"
              : cache.colorCache[key],
            selected &&
              "bg-yellow-4 text-black-8 dark:bg-yellowdark-7 hover:bg-yellow-4 dark:hover:bg-yellowdark-7",
            allClashes.length > 0 && "relative",
          )}
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: slotIndex * 0.01 + dayIndex * 0.03,
          }}
        >
          {slot.join(" / ")}
          <MotionDiv
            className="mt-1 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {allClashes.length > 0 && clashDetails ? (
              <></>
            ) : (
              <>
                <p>{cache.teacherCache[key]}</p>
                <p>{cache.venueCache[key]}</p>
              </>
            )}
          </MotionDiv>
          {allClashes.length > 0 && clashDetails && (
            <MotionDiv
              className="absolute top-1 right-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              whileHover={{
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.5 },
              }}
            >
              <AlertCircle className="h-4 w-4 text-red-normal" />
            </MotionDiv>
          )}
        </MotionTd>
      </TooltipTrigger>
      {allClashes.length > 0 && clashDetails && (
        <TooltipContent
          side="top"
          className="border-2 border-red-normal bg-red-ui text-red-normal"
        >
          <div className="p-1 text-xs">
            <p className="mb-1 font-bold">Slot Clash Detected!</p>
            {clashDetails.courses.map((course, i) => (
              <p key={i}>{course}</p>
            ))}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
});
