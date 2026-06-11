export type TimerType = "stopwatch" | "amrap" | "tabata" | "emom";

export type TimerConfig = {
  type: TimerType;
  amrapMinutes: number;
  tabataWorkSeconds: number;
  tabataRestSeconds: number;
  tabataRounds: number;
  emomIntervalMinutes: number;
  emomRounds: number;
};

export const TIMER_TYPES: { type: TimerType; label: string; description: string }[] =
  [
    {
      type: "stopwatch",
      label: "Stopwatch",
      description: "Count up — track your own pace with no time cap.",
    },
    {
      type: "amrap",
      label: "AMRAP",
      description: "Count down for a set duration. Log reps as you go.",
    },
    {
      type: "tabata",
      label: "Tabata",
      description: "Alternate work and rest intervals for set rounds.",
    },
    {
      type: "emom",
      label: "EMOM",
      description: "Every minute on the minute — work each interval, rest the remainder.",
    },
  ];

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  type: "stopwatch",
  amrapMinutes: 20,
  tabataWorkSeconds: 20,
  tabataRestSeconds: 10,
  tabataRounds: 8,
  emomIntervalMinutes: 1,
  emomRounds: 10,
};

export function formatTimerDisplay(totalSeconds: number): string {
  const abs = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getTimerTypeLabel(type: TimerType): string {
  return TIMER_TYPES.find((t) => t.type === type)?.label ?? type;
}
