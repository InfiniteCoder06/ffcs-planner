"use client";

import { GithubIcon } from "lucide-react";

import { SimpleButton } from "@/components/ui/button";
import { MotionDiv } from "./ui/motion";

export function IssueButton() {
  return (
    <MotionDiv
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SimpleButton
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
      </SimpleButton>
    </MotionDiv>
  );
}
