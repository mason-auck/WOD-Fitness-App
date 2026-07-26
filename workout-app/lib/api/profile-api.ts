import { apiFetch } from "@/lib/api";
import type { SkillLevel, SkillProgress } from "@/constants/skill-level";

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileStats = {
  workoutsLogged: number;
  prsLogged: number;
  streakDays: number;
};

export type RecentActivityItem = {
  id: string;
  kind: string;
  title: string;
  date: string;
  result: string;
};

export type MeSkill = {
  totalXp: number;
  wodsLogged: number;
  prsLogged: number;
  skillProgress: SkillProgress;
};

export async function getProfile() {
  return apiFetch("/api/v1/me") as Promise<Profile>;
}

export async function getProfileStats() {
  return apiFetch("/api/v1/me/stats") as Promise<ProfileStats>;
}

export async function getRecentActivity() {
  return apiFetch("/api/v1/me/recent-activity") as Promise<RecentActivityItem[]>;
}

export async function getMeSkill() {
  return apiFetch("/api/v1/me/skill") as Promise<MeSkill>;
}

export async function getSkillLevels() {
  return apiFetch("/api/v1/skill-levels") as Promise<SkillLevel[]>;
}
