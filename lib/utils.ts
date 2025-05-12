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

export type TailwindColor =
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

export type ColorVariant =
  | "bgLight"
  | "bgLightHover"
  | "bg"
  | "bgHover"
  | "bgDark"
  | "bgDarkHover"
  | "text"
  | "textHover"
  | "borderLight"
  | "borderLightHover"
  | "border"
  | "borderHover";

export function getColorVariant(
  color: TailwindColor,
  keys: ColorVariant[],
): string {
  const variants: Record<ColorVariant, string> = {
    bgLight: `bg-${color}-100 dark:bg-${color}-800/40`,
    bgLightHover: `hover:bg-${color}-200 dark:hover:bg-${color}-900`,
    bg: `bg-${color}-200 dark:bg-${color}-900`,
    bgHover: `hover:bg-${color}-300 dark:hover:bg-${color}-900`,
    bgDark: `bg-${color}-900 dark:bg-${color}-800`,
    bgDarkHover: `hover:bg-${color}-900 dark:hover:bg-${color}-800`,

    text: `text-${color}-800 dark:text-${color}-50`,
    textHover: `hover:text-${color}-900 dark:hover:text-${color}-100`,

    borderLight: `border-${color}-200 dark:border-${color}-300`,
    borderLightHover: `hover:border-${color}-300 dark:hover:border-${color}-400`,
    border: `border-${color}-200 dark:border-${color}-900`,
    borderHover: `hover:border-${color}-300 dark:hover:border-${color}-800`,
  };
  return keys.map((key) => variants[key]).join(" ");
}
