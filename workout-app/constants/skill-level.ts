import { INITIAL_CALENDAR_LOGS } from "@/constants/calendar";
import { INITIAL_EXERCISES } from "@/constants/personal-records";

export const XP_PER_WOD = 40;
export const XP_PER_PR = 45;

export type SkillLevel = {
  level: number;
  title: string;
  xpRequired: number;
};

export const SKILL_LEVELS: SkillLevel[] = [
  { level: 1, title: "Beginner", xpRequired: 0 },
  { level: 2, title: "Novice", xpRequired: 100 },
  { level: 3, title: "Intermediate", xpRequired: 400 },
  { level: 4, title: "Advanced", xpRequired: 750 },
  { level: 5, title: "Elite", xpRequired: 1200 },
];

export type SkillProgress = {
  totalXp: number;
  currentLevel: SkillLevel;
  nextLevel: SkillLevel | null;
  xpIntoLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  isMaxLevel: boolean;
};

export function getSkillProgress(totalXp: number): SkillProgress {
  let currentLevel = SKILL_LEVELS[0];

  for (const level of SKILL_LEVELS) {
    if (totalXp >= level.xpRequired) {
      currentLevel = level;
    }
  }

  const currentIndex = SKILL_LEVELS.findIndex(
    (level) => level.level === currentLevel.level,
  );
  const nextLevel = SKILL_LEVELS[currentIndex + 1] ?? null;
  const isMaxLevel = nextLevel === null;

  const xpIntoLevel = totalXp - currentLevel.xpRequired;
  const xpToNextLevel = isMaxLevel
    ? 0
    : nextLevel.xpRequired - currentLevel.xpRequired;
  const progressPercent = isMaxLevel
    ? 1
    : Math.min(1, xpIntoLevel / xpToNextLevel);

  return {
    totalXp,
    currentLevel,
    nextLevel,
    xpIntoLevel,
    xpToNextLevel,
    progressPercent,
    isMaxLevel,
  };
}

export function formatSkillLevelLabel(progress: SkillProgress): string {
  return `Level ${progress.currentLevel.level} – ${progress.currentLevel.title}`;
}

export function computeInitialXp(): number {
  const wodCount = INITIAL_CALENDAR_LOGS.filter((log) => log.kind === "wod").length;
  const prCount = INITIAL_EXERCISES.reduce(
    (sum, exercise) => sum + exercise.history.length,
    0,
  );

  return wodCount * XP_PER_WOD + prCount * XP_PER_PR;
}
