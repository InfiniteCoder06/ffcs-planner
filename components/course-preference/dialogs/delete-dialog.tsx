import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { MotionDiv } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

interface DeleteDialogProps {
  title?: string;
  description?: string;
  useSolid?: boolean;
  buttonText?: string;
  buttonDisabled?: boolean;
  onConfirm: () => void;
}

export function DeleteDialog({
  title,
  description,
  useSolid,
  onConfirm,
  buttonText,
  buttonDisabled,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconButton
          icon="delete"
          variant={useSolid ? "errorSolid" : "error"}
          size="sm"
          label={buttonText}
          disabled={buttonDisabled}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{title || "Confirm Deletion"}</AlertDialogTitle>
            <AlertDialogDescription>
              {description || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={cn(buttonVariants({ variant: "error" }))}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </MotionDiv>
      </AlertDialogContent>
    </AlertDialog>
  );
}
