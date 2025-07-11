import type { TimeRange } from "../types";

export const days = ["MON", "TUE", "WED", "THU", "FRI"];

type Slot = string[];
type Day = (typeof days)[number];
type TimetableData = Record<Day, Slot[]>;

export const THEORY_HOURS: TimeRange[] = [
  { start: "8:00 AM", end: "8:50 AM" },
  { start: "9:00 AM", end: "9:50 AM" },
  { start: "10:00 AM", end: "10:50 AM" },
  { start: "11:00 AM", end: "11:50 AM" },
  { start: "12:00 PM", end: "12:50 PM" },
  { start: "-", end: "-" }, // Break
  { start: "", end: "" }, // Lunch
  { start: "2:00 PM", end: "2:50 PM" },
  { start: "3:00 PM", end: "3:50 PM" },
  { start: "4:00 PM", end: "4:50 PM" },
  { start: "5:00 PM", end: "5:50 PM" },
  { start: "6:00 PM", end: "6:50 PM" },
  { start: "6:51 PM", end: "7:00 PM" },
];

export const LAB_HOURS: TimeRange[] = [
  { start: "08:00 AM", end: "09:40 AM" },
  { start: "09:50 AM", end: "11:30 AM" },
  { start: "11:40 AM", end: "01:20 PM" },
  { start: "", end: "" }, // Lunch
  { start: "2:00 PM", end: "3:40 PM" },
  { start: "3:51 PM", end: "5:30 PM" },
  { start: "5:40 PM", end: "7:20 PM" },
];

export const timetableData: TimetableData = {
  MON: [
    ["A1", "L1"],
    ["F1", "L2"],
    ["D1", "L3"],
    ["TB1", "L4"],
    ["TG1", "L5"],
    ["L6"],
    [""],
    ["A2", "L31"],
    ["F2", "L32"],
    ["D2", "L33"],
    ["TB2", "L34"],
    ["TG2", "L35"],
    ["L36"],
  ],
  TUE: [
    ["B1", "L7"],
    ["G1", "L8"],
    ["E1", "L9"],
    ["TC1", "L10"],
    ["TAA1", "L11"],
    ["L12"],
    [""],
    ["B2", "L37"],
    ["G2", "L38"],
    ["E2", "L39"],
    ["TC2", "L40"],
    ["TAA2", "L41"],
    ["L42"],
  ],
  WED: [
    ["C1", "L13"],
    ["A1", "L14"],
    ["F1", "L15"],
    ["L16"],
    ["L17"],
    ["L18"],
    [""],
    ["C2", "L43"],
    ["A2", "L44"],
    ["F2", "L45"],
    ["TD2", "L46"],
    ["TBB2", "L47"],
    ["L48"],
  ],
  THU: [
    ["D1", "L19"],
    ["B1", "L20"],
    ["G1", "L21"],
    ["TE1", "L22"],
    ["TCC1", "L23"],
    ["L24"],
    [""],
    ["D2", "L49"],
    ["B2", "L50"],
    ["G2", "L51"],
    ["TE2", "L52"],
    ["TCC2", "L53"],
    ["L54"],
  ],
  FRI: [
    ["E1", "L25"],
    ["C1", "L26"],
    ["TA1", "L27"],
    ["TF1", "L28"],
    ["TD1", "L29"],
    ["L30"],
    [""],
    ["E2", "L55"],
    ["C2", "L56"],
    ["TA2", "L57"],
    ["TF2", "L58"],
    ["TDD2", "L59"],
    ["L60"],
  ],
};

export const morningTheorySlots = [
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
  "F1",
  "G1",
  "TA1",
  "TB1",
  "TC1",
  "TE1",
  "TF1",
  "TG1",
  "TD1",
  "TAA1",
  "TCC1",
];

export const afternoonTheorySlots = [
  "A2",
  "B2",
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
  "TB2",
  "TC2",
  "TD2",
  "TE2",
  "TF2",
  "TG2",
  "TA2",
  "TBB2",
  "TCC2",
  "TDD2",
];

export const morningLabSlots = [
  ["L1", "L2"],
  ["L3", "L4"],
  ["L5", "L6"],
  ["L7", "L8"],
  ["L9", "L10"],
  ["L11", "L12"],
  ["L13", "L14"],
  ["L15", "L16"],
  ["L17", "L18"],
  ["L19", "L20"],
  ["L21", "L22"],
  ["L23", "L24"],
  ["L25", "L26"],
  ["L27", "L28"],
  ["L29", "L30"],
];

export const afternoonLabSlots = [
  ["L31", "L32"],
  ["L33", "L34"],
  ["L35", "L36"],
  ["L37", "L38"],
  ["L39", "L40"],
  ["L41", "L42"],
  ["L43", "L44"],
  ["L45", "L46"],
  ["L47", "L48"],
  ["L49", "L50"],
  ["L51", "L52"],
  ["L53", "L54"],
  ["L55", "L56"],
  ["L57", "L58"],
  ["L59", "L60"],
];

// Manual clashes that apply if slots occur on the same day
export const clashMap: string[][] = [
  ["TB1", "L5"],
  ["TC1", "L11"],
  ["TE1", "L23"],
  ["TF1", "L29"],
  ["TB2", "L35"],
  ["TC2", "L41"],
  ["TD2", "L47"],
  ["TE2", "L53"],
  ["TF2", "L59"],
];

type SlotType = "ELA" | "ETH";

interface SlotEntry {
  slot: string;
  course: string;
  type: SlotType;
}

interface TeacherMap {
  [teacher: string]: {
    ELA: SlotEntry[];
    ETH: SlotEntry[];
  };
}

export function mergeSlots(dataLines: string[]): string[] {
  const teacherMap: TeacherMap = {};

  // Parse and group by teacher
  for (const line of dataLines) {
    const [slotStr, course, ...rest] = line.split(/\s+/);
    const type = rest.pop() as SlotType;
    const teacher = rest.join(" ");

    if (!teacherMap[teacher]) {
      teacherMap[teacher] = { ELA: [], ETH: [] };
    }

    teacherMap[teacher][type].push({ slot: slotStr, course, type });
  }

  // Helpers to determine morning/afternoon slots
  const isMorning = (slot: string) => {
    // Check if it's a morning lab slot (L1-L30)
    const labMatch = slot.match(/L(\d+)/);
    if (labMatch) {
      return parseInt(labMatch[1]) <= 30;
    }
    // Check if it's a morning theory slot
    return morningTheorySlots.includes(slot);
  };

  const isAfternoon = (slot: string) => {
    // Check if it's an afternoon lab slot (L31-L60)
    const labMatch = slot.match(/L(\d+)/);
    if (labMatch) {
      return parseInt(labMatch[1]) > 30;
    }
    // Check if it's an afternoon theory slot
    return afternoonTheorySlots.includes(slot);
  };

  const result: string[] = [];

  for (const [teacher, { ELA, ETH }] of Object.entries(teacherMap)) {
    const merged: string[] = [];
    const usedETH = new Set<string>();

    for (const elaEntry of ELA) {
      let prefix = "";
      const elaSlots = elaEntry.slot.split("+");

      for (const ethEntry of ETH) {
        const ethSlot = ethEntry.slot;
        if (
          !usedETH.has(ethSlot) &&
          ((morningTheorySlots.includes(ethSlot) &&
            elaSlots.some(isAfternoon)) ||
            (afternoonTheorySlots.includes(ethSlot) &&
              elaSlots.some(isMorning)))
        ) {
          prefix = ethSlot + "+";
          usedETH.add(ethSlot);
          break;
        }
      }

      merged.push(
        `${prefix}${elaEntry.slot}\t${elaEntry.course}\t${teacher}\tELA`,
      );
    }

    for (const ethEntry of ETH) {
      if (!usedETH.has(ethEntry.slot)) {
        merged.push(`${ethEntry.slot}\t${ethEntry.course}\t${teacher}\tETH`);
      }
    }

    result.push(...merged);
  }

  return result;
}
