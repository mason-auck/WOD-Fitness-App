import { apiFetch } from "@/lib/api";
import type { ActivityLogDto } from "@/lib/api/activity-api";
import type { Wod } from "@/constants/wods";

// gets wods from backend with filtered query parameters
export async function getWods(params?: {
  q?: string;
  type?: string;
  category?: string;
  favorited?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.type) query.set("type", params.type);
  if (params?.category) query.set("category", params.category);
  if (params?.favorited != null) {
    query.set("favorites", String(params.favorited));
  }
  const qs = query.toString();

  return apiFetch(`/api/v1/wods${qs ? `?${qs}` : ""}`) as Promise<Wod[]>;
}

export async function getWodHistory(id: string) {
  return apiFetch(`/api/v1/wods/${id}/history`) as Promise<ActivityLogDto[]>;
}

export function createWod(body: {
  title: string;
  type: string;
  description?: string;
}) {
  return apiFetch("/api/v1/wods", {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<Wod>;
}

/** Get a single WOD by id. */
export async function getWodById(id: string) {
  return apiFetch(`/api/v1/wods/${id}`) as Promise<Wod>;
}

export async function favoriteWod(id: string) {
  return apiFetch(`/api/v1/wods/${id}/favorite`, { method: "POST" });
}

export async function unfavoriteWod(id: string) {
  return apiFetch(`/api/v1/wods/${id}/favorite`, { method: "DELETE" });
}
