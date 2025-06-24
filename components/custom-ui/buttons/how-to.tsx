"use client";

import { CircleQuestionMarkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HowToButton() {
  return (
    <Button
      variant="success"
      onClick={() => {
        window.open("https://infinite-coder.notion.site/", "_blank");
      }}
    >
      <CircleQuestionMarkIcon className="w-4 h-4" />
      How to?
    </Button>
  );
}
