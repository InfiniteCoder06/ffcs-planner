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
} from "@/components/ui/alert-dialog"
import React from "react"
import { IconButton } from "../ui/icon-button"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"

interface DeleteDialogProps {
  title?: string
  description?: string
  buttonText?: string
  buttonDisabled?: boolean
  onConfirm: () => void
}

export function DeleteDialog({ title, description, onConfirm, buttonText, buttonDisabled }: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconButton
          icon="delete"
          variant="error"
          size="sm"
          label={buttonText}
          disabled={buttonDisabled}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Confirm Deletion"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={cn(buttonVariants({ variant: "error" }))}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}