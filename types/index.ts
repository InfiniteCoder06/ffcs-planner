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

export interface TeacherInfo {
  name: string;
  color: string;
  venue: string;
  course: string;
}

export interface TimetableCache {
  colorCache: Record<string, string>;
  teacherCache: Record<string, string>;
  courseCache: Record<string, string>;
  venueCache: Record<string, string>;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface TeacherData {
  name: string;
  color: string;
  venue: string;
  courseId: string;
}

export interface ClashDetails {
  teachers: string[];
  courses: string[];
  slots: string[];
}

export interface SlotData {
  slotMap: Map<string, TeacherData>;
  clashCache: Record<string, boolean>;
  clashDetailsCache: Record<string, ClashDetails>;
}

export interface CellData {
  colorCache: Record<string, string>;
  teacherCache: Record<string, string>;
  venueCache: Record<string, string>;
}

export interface CellRenderData {
  color: string;
  teacherName: string;
  courseCode: string;
  venue: string;
  isClash: boolean;
  clashDetails: { courses: string[] } | null;
  isSelectedManual: boolean;
}

export interface TimetableRenderData {
  cellsData: Record<string, Record<string, CellRenderData>>; // Day -> SlotKey -> CellRenderData
  totalCredits: number;
  allClashesCount: number;
  manualSelectedSlots: string[];
}
