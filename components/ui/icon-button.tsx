import React from "react";
import { Button } from "./button";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { ButtonSize, ButtonVariant } from "@/types";

type IconType = "add" | "edit" | "delete" | "check" | "close";

interface IconButtonProps {
  icon: IconType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function IconButton({
  icon,
  variant = "default",
  size = "sm",
  onClick,
  disabled,
  className,
  label,
}: IconButtonProps) {
  const getIcon = () => {
    switch (icon) {
      case "add":
        return <PlusIcon className="w-4 h-4" />;
      case "edit":
        return <PencilIcon className="w-4 h-4" />;
      case "delete":
        return <TrashIcon className="w-4 h-4" />;
      case "check":
        return <CheckIcon className="w-4 h-4" />;
      case "close":
        return <XIcon className="w-4 h-4" />;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {getIcon()}
      {label && label}
    </Button>
  );
}
