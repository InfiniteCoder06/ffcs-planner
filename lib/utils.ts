import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { name: "Cyan", value: "cyan" },
  { name: "Fuchsia", value: "fuchsia" },
  { name: "Indigo", value: "indigo" },
  { name: "Lime", value: "lime" },
  { name: "Orange", value: "orange" },
  { name: "Pink", value: "pink" },
  { name: "Purple", value: "purple" },
  { name: "Teal", value: "teal" },
];

export const uiColors = [
  [...colors],
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Gray", value: "gray" },
  { name: "Red", value: "red" },
  { name: "Yellow", value: "yellow" },
];

export type ColorVariant =
  | "cyan"
  | "fuchsia"
  | "indigo"
  | "lime"
  | "orange"
  | "pink"
  | "purple"
  | "teal"
  | "blue"
  | "green"
  | "gray"
  | "red"
  | "yellow";
export type ColorVariantProps =
  | "bgLight"
  | "bg"
  | "bgDeep"
  | "bgHover"
  | "text"
  | "border";

const colorVariants: Record<ColorVariant, Record<ColorVariantProps, string>> = {
  cyan: {
    bgLight: "bg-cyan-100 dark:bg-cyan-800/40",
    bg: "bg-cyan-200 dark:bg-cyan-900",
    bgDeep: "bg-cyan-300 dark:bg-cyan-900",
    bgHover: "hover:bg-cyan-300 dark:hover:bg-cyan-900",
    text: "text-cyan-800 hover:text-cyan-900 dark:text-cyan-50",
    border: "border-cyan-200 hover:border-cyan-300 dark:border-cyan-900",
  },
  fuchsia: {
    bgLight: "bg-fuchsia-100 dark:bg-fuchsia-800/40",
    bg: "bg-fuchsia-200 dark:bg-fuchsia-900",
    bgDeep: "bg-fuchsia-300 dark:bg-fuchsia-900",
    bgHover: "hover:bg-fuchsia-300 dark:hover:bg-fuchsia-900",
    text: "text-fuchsia-800 hover:text-fuchsia-900 dark:text-fuchsia-50",
    border:
      "border-fuchsia-200 hover:border-fuchsia-300 dark:border-fuchsia-900",
  },
  indigo: {
    bgLight: "bg-indigo-100 dark:bg-indigo-800/40",
    bg: "bg-indigo-200 dark:bg-indigo-900",
    bgDeep: "bg-indigo-300 dark:bg-indigo-900",
    bgHover: "hover:bg-indigo-300 dark:hover:bg-indigo-900",
    text: "text-indigo-800 hover:text-indigo-900 dark:text-indigo-50",
    border: "border-indigo-200 hover:border-indigo-300 dark:border-indigo-900",
  },
  lime: {
    bgLight: "bg-lime-100 dark:bg-lime-800/40",
    bg: "bg-lime-200 dark:bg-lime-900",
    bgDeep: "bg-lime-300 dark:bg-lime-900",
    bgHover: "hover:bg-lime-300 dark:hover:bg-lime-900",
    text: "text-lime-800 hover:text-lime-900 dark:text-lime-50",
    border: "border-lime-200 hover:border-lime-300 dark:border-lime-900",
  },
  orange: {
    bgLight: "bg-orange-100 dark:bg-orange-800/40",
    bg: "bg-orange-200 dark:bg-orange-900",
    bgDeep: "bg-orange-300 dark:bg-orange-900",
    bgHover: "hover:bg-orange-300 dark:hover:bg-orange-900",
    text: "text-orange-800 hover:text-orange-900 dark:text-orange-50",
    border: "border-orange-200 hover:border-orange-300 dark:border-orange-900",
  },
  pink: {
    bgLight: "bg-pink-100 dark:bg-pink-800/40",
    bg: "bg-pink-200 dark:bg-pink-900",
    bgDeep: "bg-pink-300 dark:bg-pink-900",
    bgHover: "hover:bg-pink-300 dark:hover:bg-pink-900",
    text: "text-pink-800 hover:text-pink-900 dark:text-pink-50",
    border: "border-pink-200 hover:border-pink-300 dark:border-pink-900",
  },
  purple: {
    bgLight: "bg-purple-100 dark:bg-purple-800/40",
    bg: "bg-purple-200 dark:bg-purple-900",
    bgDeep: "bg-purple-300 dark:bg-purple-900",
    bgHover: "hover:bg-purple-300 dark:hover:bg-purple-900",
    text: "text-purple-800 hover:text-purple-900 dark:text-purple-50",
    border: "border-purple-200 hover:border-purple-300 dark:border-purple-900",
  },
  teal: {
    bgLight: "bg-teal-100 dark:bg-teal-800/40",
    bg: "bg-teal-200 dark:bg-teal-900",
    bgDeep: "bg-teal-300 dark:bg-teal-900",
    bgHover: "hover:bg-teal-300 dark:hover:bg-teal-900",
    text: "text-teal-800 hover:text-teal-900 dark:text-teal-50",
    border: "border-teal-200 hover:border-teal-300 dark:border-teal-900",
  },
  blue: {
    bgLight: "bg-blue-100 dark:bg-blue-800/40",
    bg: "bg-blue-200 dark:bg-blue-900",
    bgDeep: "bg-blue-300 dark:bg-blue-900",
    bgHover: "hover:bg-blue-300 dark:hover:bg-blue-900",
    text: "text-blue-800 hover:text-blue-900 dark:text-blue-50",
    border: "border-blue-200 hover:border-blue-300 dark:border-blue-900",
  },
  green: {
    bgLight: "bg-green-100 dark:bg-green-800/40",
    bg: "bg-green-200 dark:bg-green-900",
    bgDeep: "bg-green-300 dark:bg-green-900",
    bgHover: "hover:bg-green-300 dark:hover:bg-green-900",
    text: "text-green-800 hover:text-green-900 dark:text-green-50",
    border: "border-green-200 hover:border-green-300 dark:border-green-900",
  },
  gray: {
    bgLight: "bg-gray-100 dark:bg-gray-800/40",
    bg: "bg-gray-200 dark:bg-gray-900",
    bgDeep: "bg-gray-300 dark:bg-gray-900",
    bgHover: "hover:bg-gray-300 dark:hover:bg-gray-900",
    text: "text-gray-800 hover:text-gray-900 dark:text-gray-50",
    border: "border-gray-200 hover:border-gray-300 dark:border-gray-900",
  },
  red: {
    bgLight: "bg-red-100 dark:bg-red-800/40",
    bg: "bg-red-200 dark:bg-red-900",
    bgDeep: "bg-red-300 dark:bg-red-900",
    bgHover: "hover:bg-red-300 dark:hover:bg-red-900",
    text: "text-red-800 hover:text-red-900 dark:text-red-50",
    border: "border-red-200 hover:border-red-300 dark:border-red-900",
  },
  yellow: {
    bgLight: "bg-yellow-100 dark:bg-yellow-600/40",
    bg: "bg-yellow-200 dark:bg-yellow-900",
    bgDeep: "bg-yellow-300 dark:bg-yellow-900",
    bgHover: "hover:bg-yellow-300 dark:hover:bg-yellow-900",
    text: "text-yellow-800 hover:text-yellow-900 dark:text-yellow-50",
    border: "border-yellow-200 hover:border-yellow-300 dark:border-yellow-900",
  },
};

export function getColorVariant(
  color: ColorVariant,
  props: ColorVariantProps[],
) {
  return cn(...props.map((p) => colorVariants[color][p]));
}
