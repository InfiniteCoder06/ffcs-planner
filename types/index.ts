export type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "success"
  | "warning"
  | "warningSolid"
  | "error"
  | "errorSolid"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonIconType = "add" | "edit";

export interface DialogButtonProps {
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonIcon?: ButtonIconType;
  buttonText?: string;
  disabled?: boolean;
}
