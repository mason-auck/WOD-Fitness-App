import { apiFetch } from "@/lib/api";
import type { CalendarLog } from "@/constants/calendar";
import type { WodType } from "@/constants/wods";

export type ActivityLogDto = {
  id: string;
  kind: "wod" | "pr" | string;
  dateKey: string;
  wodId: string | null;
  exerciseId: string | null;
  title: string;
  wodType: string | null;
  result: string;
  notes: string | null;
};

export function toCalendarLog(dto: ActivityLogDto): CalendarLog {
  const dateKey = String(dto.dateKey);
  const notes = dto.notes ?? undefined;

  if (dto.kind === "pr") {
    return {
      id: dto.id,
      kind: "pr",
      dateKey,
      prId: dto.exerciseId ?? "",
      movement: dto.title,
      value: dto.result,
      notes,
    };
  }

  return {
    id: dto.id,
    kind: "wod",
    dateKey,
    wodId: dto.wodId ?? "",
    title: dto.title,
    wodType: (dto.wodType as WodType) ?? "Custom",
    score: dto.result,
    notes,
  };
}

export async function getActivityLogs(params?: {
  from?: string;
  to?: string;
  kind?: string;
}) {
  const query = new URLSearchParams();
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.kind) query.set("kind", params.kind);
  const qs = query.toString();

  return apiFetch(
    `/api/v1/activity-logs${qs ? `?${qs}` : ""}`,
  ) as Promise<ActivityLogDto[]>;
}

export async function createActivityLog(body: {
  kind: "wod" | "pr";
  loggedOn: string;
  wodId?: string;
  exerciseId?: string;
  result: string;
  notes?: string;
}) {
  return apiFetch("/api/v1/activity-logs", {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<ActivityLogDto>;
}

export async function deleteActivityLog(id: string) {
  return apiFetch(`/api/v1/activity-logs/${id}`, {
    method: "DELETE",
  }) as Promise<null>;
}
