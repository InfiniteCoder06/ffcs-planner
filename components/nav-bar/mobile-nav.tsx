"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { IssueButton } from "@/components/nav-bar/buttons/issues";
import { ModeToggle } from "@/components/nav-bar/buttons/mode-toggle";
import { AnimatedButton } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ChangelogDialog } from "../changelog-dialog";
import { HowToButton } from "./buttons/how-to";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden fixed top-4 right-4 z-50 flex gap-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <AnimatedButton variant="outline" size="icon">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </AnimatedButton>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6 items-center">
            <ChangelogDialog currentAppVersion={undefined} />
            <HowToButton />
            <IssueButton />
            <ModeToggle isMobile />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
