"use client";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

import type React from "react";

interface MotionProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
}

export function MotionDiv({
  children,
  className,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { duration: 0.2 },
  ...props
}: MotionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatePresenceWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  mode?: "sync" | "wait" | "popLayout";
}

export function AnimatePresenceWrapper({
  children,
  mode = "sync",
}: AnimatePresenceWrapperProps) {
  return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}

// Animation presets
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const slideInFromTop = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export const slideInFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

export const slideInFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

export const slideInFromBottom = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export const scaleUp = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
};

// Scroll animation components
interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale";
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  className,
  animation = "fadeIn",
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getAnimationProps = () => {
    switch (animation) {
      case "fadeIn":
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : { opacity: 0 },
        };
      case "slideUp":
        return {
          initial: { opacity: 0, y: 50 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
        };
      case "slideLeft":
        return {
          initial: { opacity: 0, x: 50 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 },
        };
      case "slideRight":
        return {
          initial: { opacity: 0, x: -50 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: isInView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.8 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : { opacity: 0 },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      {...getAnimationProps()}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

// Parallax effect component
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate transform based on direction
  let transformX = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
  let transformY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  const amount = 100 * speed;

  switch (direction) {
    case "up":
      transformY = useTransform(scrollYProgress, [0, 1], [`0%`, `-${amount}%`]);
      break;
    case "down":
      transformY = useTransform(scrollYProgress, [0, 1], [`0%`, `${amount}%`]);
      break;
    case "left":
      transformX = useTransform(scrollYProgress, [0, 1], [`0%`, `-${amount}%`]);
      break;
    case "right":
      transformX = useTransform(scrollYProgress, [0, 1], [`0%`, `${amount}%`]);
      break;
  }

  const springTransformX = useSpring(transformX, {
    stiffness: 100,
    damping: 30,
  });
  const springTransformY = useSpring(transformY, {
    stiffness: 100,
    damping: 30,
  });

  const style =
    direction === "up" || direction === "down"
      ? { y: springTransformY }
      : { x: springTransformX };

  return (
    <motion.div ref={ref} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export const MotionDivClient = MotionDiv;
export const MotionTr = motion.tr;
export const MotionTd = motion.td;
export const MotionLi = motion.li;
export const MotionUl = motion.ul;
