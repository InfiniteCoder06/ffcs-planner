"use client";

import { useMemo } from "react";
import { useScheduleStore, type Teacher } from "@/lib/store";
import { AddTeacherDialog } from "../dialogs/add-teacher-dialog";
import TeacherItem from "../items/teacher-item";
import { AnimatePresenceWrapper, MotionDiv, MotionUl } from "../ui/motion";

interface TeacherListProps {
	courseTeachers: Teacher[];
	editMode: boolean;
}

export default function TeacherList({
	courseTeachers,
	editMode,
}: TeacherListProps) {
	const { teacherSlotClash } = useScheduleStore();

	const teacherStates = useMemo(() => {
		return courseTeachers
			.map((teacher) => {
				const clashes = teacherSlotClash(teacher.id);
				return {
					teacher,
					clashes,
				};
			})
			.sort((a, b) => a.clashes.length - b.clashes.length); // Non-clashing first
	}, [courseTeachers, teacherSlotClash]);

	return (
		<div className="p-4 border-t">
			<div className="flex items-center justify-between mb-2">
				<p className="text-sm font-medium">
					Teachers ({courseTeachers.length})
				</p>
				<AddTeacherDialog
					teacherToEdit={null}
					buttonVariant="ghost"
					buttonSize="sm"
				/>
			</div>

			{teacherStates.length === 0 ? (
				<MotionDiv
					className="p-4 text-center border rounded-lg text-muted-foreground"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.3 }}
				>
					No teachers selected. Add teachers to your timetable to see them here.
				</MotionDiv>
			) : (
				<AnimatePresenceWrapper>
					<MotionUl
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="space-y-3"
						layout
					>
						{teacherStates.map(({ teacher, clashes }, index) => (
							<TeacherItem
								key={teacher.id}
								teacher={teacher}
								editMode={editMode}
								clashedTeachers={clashes}
								className={clashes.length > 0 ? "opacity-50" : ""}
								index={index}
							/>
						))}
					</MotionUl>
				</AnimatePresenceWrapper>
			)}
		</div>
	);
}
