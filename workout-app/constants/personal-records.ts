export type PrLogEntry = {
  id: string;
  value: string;
  dateKey: string;
  notes?: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  history: PrLogEntry[];
};

/** @deprecated Use Exercise — kept for gradual migration */
export type PersonalRecord = {
  id: string;
  movement: string;
  category: string;
  currentPr: string;
};

export function getCurrentPr(exercise: Exercise): string | null {
  if (exercise.history.length === 0) return null;

  const sorted = [...exercise.history].sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey),
  );
  return sorted[0].value;
}

export function exerciseToPersonalRecord(exercise: Exercise): PersonalRecord {
  return {
    id: exercise.id,
    movement: exercise.name,
    category: exercise.category,
    currentPr: getCurrentPr(exercise) ?? "—",
  };
}

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Weightlifting",
    history: [
      { id: "h1", value: "175 lbs", dateKey: "2026-04-10" },
      { id: "h2", value: "185 lbs", dateKey: "2026-05-22" },
    ],
  },
  {
    id: "2",
    name: "Back Squat",
    category: "Weightlifting",
    history: [{ id: "h3", value: "225 lbs", dateKey: "2026-06-06" }],
  },
  {
    id: "3",
    name: "Deadlift",
    category: "Weightlifting",
    history: [{ id: "h4", value: "315 lbs", dateKey: "2026-05-15" }],
  },
  {
    id: "4",
    name: "1 Mile Run",
    category: "Cardio",
    history: [{ id: "h5", value: "6:42", dateKey: "2026-05-01" }],
  },
  {
    id: "5",
    name: "1000 Meter Row",
    category: "Cardio",
    history: [{ id: "h6", value: "3:48", dateKey: "2026-04-18" }],
  },
  {
    id: "6",
    name: "Snatch",
    category: "Weightlifting",
    history: [{ id: "h7", value: "135 lbs", dateKey: "2026-03-20" }],
  },
  {
    id: "7",
    name: "Clean & Jerk",
    category: "Weightlifting",
    history: [{ id: "h8", value: "185 lbs", dateKey: "2026-03-20" }],
  },
  {
    id: "8",
    name: "Strict Pull-ups",
    category: "Gymnastics",
    history: [{ id: "h9", value: "15 reps", dateKey: "2026-06-01" }],
  },
  {
    id: "9",
    name: "Muscle-ups",
    category: "Gymnastics",
    history: [{ id: "h10", value: "8 reps", dateKey: "2026-05-10" }],
  },
  {
    id: "10",
    name: "Fran",
    category: "Benchmarks",
    history: [{ id: "h11", value: "4:32", dateKey: "2026-06-08" }],
  },
  {
    id: "11",
    name: "Murph",
    category: "Benchmarks",
    history: [{ id: "h12", value: "42:10", dateKey: "2026-06-03" }],
  },
];

export const INITIAL_PERSONAL_RECORDS: PersonalRecord[] =
  INITIAL_EXERCISES.map(exerciseToPersonalRecord);
