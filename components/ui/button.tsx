import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { MotionDiv } from "./motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:text-graya-3 disabled:dark:text-graydarka-3",
  {
    variants: {
      variant: {
        default:
          "bg-bluea-ui text-bluea-dim focus-visible:ring-bluea-8 dark:focus-visible:ring-bluedarka-8",
        success:
          "bg-green-ui text-green-dim focus-visible:ring-greena-ui dark:focus-visible:ring-greendarka-ui",
        error:
          "bg-reda-ui text-reda-dim focus-visible:ring-reda-ui dark:focus-visible:ring-reda-ui",
        errorSolid:
          "bg-red-7 dark:bg-reddark-7 text-red-normal focus-visible:ring-red-ui dark:focus-visible:ring-red-ui",
        warning:
          "bg-yellowa-ui text-yellowa-dim focus-visible:ring-yellowa-8 dark:focus-visible:ring-yellowdarka-8",
        warningSolid:
          "bg-yellow-7 dark:bg-yellowdark-7 text-yellow-normal focus-visible:ring-yellow-ui dark:focus-visible:ring-yellow-ui",
        outline:
          "border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input/70 dark:bg-background/50 dark:text-foreground/80 ",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
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
  const Comp = asChild ? SlotPrimitive.Slot : "button";

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
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, SimpleButton, buttonVariants };
