import type { WodType } from "@/constants/wods";

export type CalendarWodLog = {
  id: string;
  kind: "wod";
  dateKey: string;
  wodId: string;
  title: string;
  wodType: WodType;
  score: string;
  notes?: string;
};

export type CalendarPrLog = {
  id: string;
  kind: "pr";
  dateKey: string;
  prId: string;
  movement: string;
  value: string;
  notes?: string;
};

export type CalendarLog = CalendarWodLog | CalendarPrLog;

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function toDateKeyFromDate(date: Date): string {
  return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatSelectedDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  return cells;
}

export const INITIAL_CALENDAR_LOGS: CalendarLog[] = [
  {
    id: "log-1",
    kind: "wod",
    dateKey: "2026-06-08",
    wodId: "1",
    title: "Fran",
    wodType: "For Time",
    score: "4:32",
    notes: "Felt strong on pull-ups.",
  },
  {
    id: "log-2",
    kind: "pr",
    dateKey: "2026-06-06",
    prId: "1",
    movement: "Back Squat",
    value: "225 lbs",
    notes: "New 1RM — depth was solid.",
  },
  {
    id: "log-3",
    kind: "wod",
    dateKey: "2026-06-03",
    wodId: "5",
    title: "Murph",
    wodType: "For Time",
    score: "42:10",
  },
  {
    id: "log-4",
    kind: "wod",
    dateKey: "2026-06-01",
    wodId: "4",
    title: "Cindy",
    wodType: "AMRAP",
    score: "18 rounds + 4",
  },
];
