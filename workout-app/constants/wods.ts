export type WodType =
  | "For Time"
  | "Weight"
  | "Reps & Time"
  | "AMRAP"
  | "Custom";

export type WodCategory =
  | "RSS WODs"
  | "Open WODs"
  | "The Girls"
  | "Heroes"
  | "Benchmarks"
  | "Bodyweight"
  | "Custom";

export type Wod = {
  id: string;
  title: string;
  type: WodType;
  category: WodCategory;
  description: string;
  favorited: boolean;
  isUserCreated?: boolean;
};

export const WOD_TYPES: WodType[] = [
  "For Time",
  "Weight",
  "Reps & Time",
  "AMRAP",
  "Custom",
];

export const WOD_CATEGORIES: WodCategory[] = [
  "RSS WODs",
  "Open WODs",
  "The Girls",
  "Heroes",
  "Benchmarks",
  "Bodyweight",
  "Custom",
];

export const INITIAL_WODS: Wod[] = [
  {
    id: "1",
    title: "Fran",
    type: "For Time",
    category: "The Girls",
    description:
      "21-15-9 reps for time of thrusters (95/65 lb) and pull-ups. Post total time to complete all reps.",
    favorited: true,
  },
  {
    id: "2",
    title: "1RM Back Squat",
    type: "Weight",
    category: "Benchmarks",
    description:
      "Work up to a 1-rep max back squat. Warm up thoroughly, then add weight each attempt until you hit your max.",
    favorited: false,
  },
  {
    id: "3",
    title: "Karen",
    type: "Reps & Time",
    category: "The Girls",
    description:
      "150 wall-ball shots (20/14 lb) for time. Post total reps completed and time if capped.",
    favorited: false,
  },
  {
    id: "4",
    title: "Cindy",
    type: "AMRAP",
    category: "The Girls",
    description:
      "20-minute AMRAP of 5 pull-ups, 10 push-ups, and 15 air squats. Score is total rounds plus reps.",
    favorited: true,
  },
  {
    id: "5",
    title: "Murph",
    type: "For Time",
    category: "Heroes",
    description:
      "1 mile run, 100 pull-ups, 200 push-ups, 300 air squats, 1 mile run. Partition reps as needed.",
    favorited: false,
  },
  {
    id: "6",
    title: "Annie",
    type: "For Time",
    category: "The Girls",
    description:
      "50-40-30-20-10 reps for time of double-unders and sit-ups.",
    favorited: false,
  },
  {
    id: "7",
    title: "Today's RSS WOD",
    type: "AMRAP",
    category: "RSS WODs",
    description:
      "Synced from RSS feed: 12-minute AMRAP of 10 toes-to-bar and 10 dumbbell snatches (50/35 lb).",
    favorited: false,
  },
  {
    id: "8",
    title: "26.1",
    type: "For Time",
    category: "Open WODs",
    description:
      "CrossFit Open workout from the current season. Check the Open page for official standards and scoring.",
    favorited: false,
  },
  {
    id: "9",
    title: "100 Burpees for Time",
    type: "For Time",
    category: "Bodyweight",
    description:
      "100 burpees for time. No equipment required — post your total time to complete all reps.",
    favorited: false,
  },
  {
    id: "10",
    title: "Partner Chipper",
    type: "Custom",
    category: "Custom",
    description:
      "With a partner, alternate movements: 50 cal row, 40 box jumps, 30 KB swings, 20 burpees, 10 cleans. Split work any way.",
    favorited: false,
    isUserCreated: true,
  },
];
