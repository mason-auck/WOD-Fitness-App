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
