import { apiFetch } from "@/lib/api";
import type { Wod } from "@/constants/wods";

// gets wods from backend with filtered query parameters
export async function getWods(params?: {
  q?: string;
  type?: string;
  category?: string;
  favorited?: boolean;
}) {
  const query = new URLSearchParams();

  // append params
  const qs = query.toString();

  return apiFetch(`/api/v1/wods${qs ? `?${qs}` : ""}`);
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

// get a single wod by id
export async function getWodById(id: string) {
  return apiFetch(`/api/v1/wods/${id}`) as Promise<Wod>;
}
