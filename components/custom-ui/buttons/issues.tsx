"use client";

import { GithubIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function IssueButton() {
  return (
    <Button
      variant="error"
      onClick={() => {
        window.open(
          "https://github.com/InfiniteCoder06/ffcs-planner/issues/new",
          "_blank",
        );
      }}
    >
      <GithubIcon className="w-4 h-4" />
      Report Issue
    </Button>
  );
}
