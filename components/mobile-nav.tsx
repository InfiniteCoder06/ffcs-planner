"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { IssueButton } from "@/components/custom-ui/buttons/issues";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HowToButton } from "./custom-ui/buttons/how-to";
import { ChangelogDialog } from "./changelog-dialog";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-4 right-4 z-50 flex gap-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
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
