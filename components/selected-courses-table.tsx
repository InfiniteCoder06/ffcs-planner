"use client";

import {
	AnimatePresenceWrapper,
	fadeIn,
	MotionDiv,
	MotionTr,
	slideInFromBottom,
} from "@/components/ui/motion";
import { useScheduleStore } from "@/lib/store";
import { cn, ColorVariant, getColorVariant } from "@/lib/utils";

import { IconButton } from "./ui/icon-button";

export function SelectedCoursesTable() {
	const { selectedTeachers, courses, toggleTeacherInTimetable } =
		useScheduleStore();

	// Calculate total credits
	const totalCredits = selectedTeachers.reduce((total, teacher) => {
		const course = courses.find((c) => c.id === teacher.course);
		return total + (course?.credits || 0);
	}, 0);

	const sortedTeachers = selectedTeachers.sort((a, b) => {
		const courseA = courses.find((c) => c.id === a.course);
		const courseB = courses.find((c) => c.id === b.course);
		return (courseA?.name || "").localeCompare(courseB?.name || "");
	});

	return (
		<AnimatePresenceWrapper mode="wait">
			{sortedTeachers.length === 0 ? (
				<MotionDiv
					key="no-courses"
					className="p-4 text-center border rounded-lg text-muted-foreground"
					{...fadeIn}
					transition={{ duration: 0.3 }}
				>
					No courses selected. Add courses to your timetable to see them here.
				</MotionDiv>
			) : (
				<MotionDiv
					key="courses-table"
					className="border rounded-lg"
					{...slideInFromBottom}
					transition={{ duration: 0.4 }}
				>
					<div className="overflow-x-auto">
						<table className="w-full overflow-hidden border-collapse divide-gray-200 rounded-lg dark:divide-gray-700">
							<thead className="p-2 font-bold text-center bg-gray-100 border select-none dark:bg-gray-800">
								<tr>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase text-start">
										Course
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Code
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Credits
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Faculty
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Colour
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Venue
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="p-2 font-bold text-center bg-gray-100 border dark:bg-gray-800">
								<AnimatePresenceWrapper>
									{sortedTeachers.map((teacher, index) => {
										const course = courses.find((c) => c.id === teacher.course);
										return (
											<MotionTr
												key={teacher.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, x: -10 }}
												transition={{
													duration: 0.2,
													delay: index * 0.05, // Staggered animation
												}}
											>
												<td className="px-6 py-4 text-sm font-medium text-start whitespace-nowrap">
													{course?.name}
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													{course?.code}
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													{course?.credits}
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													{teacher.name}
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													<div
														className={cn(
															"w-4 h-4 rounded-full m-auto",
															getColorVariant(teacher.color as ColorVariant, [
																"bg",
															]),
														)}
													></div>
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													{teacher.venue}
												</td>
												<td className="px-6 py-4 text-sm whitespace-nowrap">
													<IconButton
														icon="delete"
														variant="error"
														size="sm"
														onClick={() => toggleTeacherInTimetable(teacher.id)}
													></IconButton>
												</td>
											</MotionTr>
										);
									})}
								</AnimatePresenceWrapper>
							</tbody>
							<tfoot className="p-2 font-bold text-center bg-gray-100 border dark:bg-gray-800">
								<tr>
									<td
										colSpan={2}
										className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"
									>
										Total Credits:
									</td>
									<td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
										{totalCredits}
									</td>
									<td colSpan={2}></td>
									<td colSpan={2}></td>
								</tr>
							</tfoot>
						</table>
					</div>
				</MotionDiv>
			)}
		</AnimatePresenceWrapper>
	);
}
