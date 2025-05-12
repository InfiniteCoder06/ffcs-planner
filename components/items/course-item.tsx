"use client";

import React, { useState, useCallback } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useScheduleStore, type Course, type Teacher } from "@/lib/store";

import { AddCourseDialog } from "../dialogs/add-course-dialog";
import TeacherList from "../list/teacher-list";
import { Button } from "../ui/button";
import { AnimatePresenceWrapper, MotionDiv, MotionLi } from "../ui/motion";
import { DeleteDialog } from "../dialogs/delete-dialog";

interface CourseItemProps {
	index: number;
	course: Course;
	courseTeachers: Teacher[];
	editMode: boolean;
}

const CourseItem = React.memo(function CourseItem({
	index,
	course,
	courseTeachers,
	editMode,
}: CourseItemProps) {
	const { removeCourse } = useScheduleStore();
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpanded = useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	const handleRemove = useCallback(() => {
		removeCourse(course.id);
	}, [course.id, removeCourse]);

	return (
		<MotionLi
			className="overflow-hidden border rounded-md shadow-sm"
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 30,
				delay: index * 0.05,
			}}
			whileHover={{
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
				transition: { duration: 0.2 },
			}}
		>
			<div className="flex items-center justify-between p-3">
				<div>
					<p className="font-medium">{course.code}</p>
					<p className="text-sm text-muted-foreground">
						{course.name} • {course.credits} Credits
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleExpanded}
						aria-label={isExpanded ? "Collapse teachers" : "Expand teachers"}
						className="transition-transform duration-200"
					>
						{isExpanded ? (
							<ChevronUpIcon className="w-4 h-4" />
						) : (
							<ChevronDownIcon className="w-4 h-4" />
						)}
					</Button>
					{editMode && (
						<>
							<AddCourseDialog
								courseToEdit={course}
								buttonVariant="warning"
								buttonSize="sm"
								buttonIcon="edit"
								buttonText=""
							/>
							<DeleteDialog
								description="Are you sure you want to remove this course?"
								onConfirm={handleRemove}
							/>
						</>
					)}
				</div>
			</div>
			<AnimatePresenceWrapper>
				{isExpanded && (
					<MotionDiv
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 30,
						}}
					>
						<TeacherList courseTeachers={courseTeachers} editMode={editMode} />
					</MotionDiv>
				)}
			</AnimatePresenceWrapper>
		</MotionLi>
	);
});

export default CourseItem;
