export type TailwindColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

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

export function generateColorClasses(
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
