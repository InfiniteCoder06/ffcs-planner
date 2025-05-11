"use client";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import type React from "react";

// Type-safe props for motion.div
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

export const MotionDivClient = MotionDiv;
export const MotionTr = motion.tr;
export const MotionTd = motion.td;
export const MotionLi = motion.li;
export const MotionUl = motion.ul;
