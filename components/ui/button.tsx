import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { MotionDiv } from "./motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-blue-200 text-blue-800 shadow-xs hover:bg-blue-300 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-50 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/70",
        outline:
          "border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input/70 dark:bg-background/50 dark:text-foreground/80 ",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        success:
          "bg-green-200 text-green-800 shadow-xs hover:bg-green-300 hover:text-green-900 dark:bg-green-900 dark:text-green-50 focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/70",
        warning:
          "bg-yellow-200 text-yellow-800 shadow-xs hover:bg-yellow-300 hover:text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50 focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-500/70",
        error:
          "bg-red-200 text-red-800 shadow-xs hover:bg-red-300 hover:text-red-900 dark:bg-red-800 dark:hover:bg-red-900 dark:text-red-50 focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/70",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <MotionDiv
      className="flex items-center justify-center rounded-md"
      tabIndex={-1}
      initial={{ scale: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      exit={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    </MotionDiv>
  );
}

function SimpleButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, SimpleButton, buttonVariants };
