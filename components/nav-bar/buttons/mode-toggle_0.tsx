"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MotionDiv } from "../../ui/motion";

export function ModeToggle({ isMobile = false }: { isMobile?: boolean }) {
  const { setTheme } = useTheme();

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="" asChild>
          {isMobile ? (
            <Button variant="outline" size={"sm"}>
              <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0 dark:hidden" />
              <Moon className="w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
              <span className="">Toggle theme</span>
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0 dark:hidden" />
              <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MotionDiv>
  );
}
