"use client";

import {
  afternoonLabSlots,
  afternoonTheorySlots,
  morningLabSlots,
  morningTheorySlots,
} from "@/lib/slots";
import { Button, SimpleButton } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  AnimatePresenceWrapper,
  MotionDiv,
  ScrollAnimation,
} from "../ui/motion";
import { Check, Plus, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { manualSlotSelectionStore } from "@/lib/store";
import { useState } from "react";

export function SlotSelector() {
  const { selectedSlots, toggleSlot, clearSelectedSlots } =
    manualSlotSelectionStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ScrollAnimation animation="fadeIn" duration={0.6} className="mb-6">
      <div className="border rounded-lg shadow-sm p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <h2 className="font-bold">Manual Slot Selection</h2>
          </div>
          <div className="flex gap-2">
            <AnimatePresenceWrapper>
              {isExpanded && (
                <Button
                  variant="error"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedSlots();
                  }}
                >
                  Clear All
                </Button>
              )}
            </AnimatePresenceWrapper>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? "Collapse teachers" : "Expand teachers"}
              className="transition-transform duration-200"
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <AnimatePresenceWrapper>
          {isExpanded && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <h3 className="p-2">Morning Slots</h3>
              <div className="grid grid-cols-2 gap-2">
                <SlotGroup slots={morningTheorySlots} className="grid-cols-1" />
                <SlotGroup slots={morningLabSlots} className="grid-cols-2" />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <h3 className="p-2">Afternoon Slots</h3>
              <div className="grid grid-cols-2 gap-2">
                <SlotGroup
                  slots={afternoonTheorySlots}
                  className="grid-cols-1"
                />
                <SlotGroup slots={afternoonLabSlots} className="grid-cols-2" />
              </div>
            </MotionDiv>
          )}
        </AnimatePresenceWrapper>
      </div>
    </ScrollAnimation>
  );

  function SlotGroup({
    slots,
    className,
  }: {
    slots: string[];
    className?: string;
  }) {
    return (
      <>
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {slots.map((slot) => {
            const isSelected = selectedSlots.includes(slot);
            return (
              <SimpleButton
                key={slot}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all duration-500 basis-1/6",
                  isSelected && "bg-yellow-ui text-yellow-normal",
                )}
                onClick={() => toggleSlot(slot)}
              >
                {isSelected ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {slot}
              </SimpleButton>
            );
          })}
        </div>
      </>
    );
  }
}
