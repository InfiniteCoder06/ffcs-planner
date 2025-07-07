"use client";

import { GithubIcon } from "lucide-react";

import { AnimatedButton } from "@/components/ui/button";

export function IssueButton() {
  return (
    <AnimatedButton
      variant="red"
      onClick={() => {
        window.open(
          "https://github.com/InfiniteCoder06/ffcs-planner/issues/new",
          "_blank",
        );
      }}
    >
      <GithubIcon className="w-4 h-4" />
      Report Issue
    </AnimatedButton>
  );
}
