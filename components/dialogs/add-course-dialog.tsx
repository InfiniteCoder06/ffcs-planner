"use client";

import { useEffect, useState } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Course, useScheduleStore } from "@/lib/store";
import { DialogButtonProps } from "@/types";
import { MotionDiv } from "../ui/motion";

interface AddCourseDialogProps extends DialogButtonProps {
	courseToEdit?: Course | null;
}

export function AddCourseDialog({
	courseToEdit,
	buttonVariant = "default",
	buttonSize = "sm",
	buttonText = "Course",
	buttonIcon = "add",
	disabled = false,
}: AddCourseDialogProps) {
	const { addCourse, editCourse } = useScheduleStore();

	const [open, setOpen] = useState(false);
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [credits, setCredits] = useState("4");

	// Populate form when editing
	useEffect(() => {
		if (courseToEdit) {
			setCode(courseToEdit.code);
			setName(courseToEdit.name);
			setCredits(courseToEdit.credits.toString());
		} else {
			setCode("");
			setName("");
			setCredits("4");
		}
	}, [courseToEdit, open]);

	const handleSave = () => {
		if (!code.trim() || !name.trim()) return;

		const courseData = {
			code: code.trim(),
			name: name.trim(),
			credits: parseInt(credits) || 0,
		};

		if (courseToEdit) {
			editCourse(courseToEdit.id, courseData);
		} else {
			addCourse(courseData);
		}

		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize} disabled={disabled}>
					{buttonIcon === "add" && <PlusIcon className="w-4 h-4" />}
					{buttonIcon === "edit" && <PencilIcon className="w-4 h-4" />}
					{buttonText && buttonText}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<DialogHeader>
						<DialogTitle>
							{courseToEdit ? "Edit Course" : "Add Course"}
						</DialogTitle>
						<DialogDescription>
							{courseToEdit
								? "Edit the course details below:"
								: "Enter the course details below to add it to your FFCS planner."}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<MotionDiv
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.05 }}
							className="grid gap-2"
						>
							<Label htmlFor="code">Course Code</Label>
							<Input
								id="code"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="CS101"
							/>
						</MotionDiv>

						<MotionDiv
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className="grid gap-2"
						>
							<Label htmlFor="name">Course Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Introduction to Programming"
							/>
						</MotionDiv>

						<MotionDiv
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.15 }}
							className="grid gap-2"
						>
							<Label htmlFor="credits">Credits</Label>
							<Input
								id="credits"
								type="number"
								min="1"
								value={credits}
								onChange={(e) => setCredits(e.target.value)}
							/>
						</MotionDiv>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							variant="success"
							onClick={handleSave}
							disabled={!code.trim() || !name.trim() || !credits}
						>
							{courseToEdit ? "Update" : "Save"}
						</Button>
					</DialogFooter>
				</MotionDiv>
			</DialogContent>
		</Dialog>
	);
}
