import { apiFetch } from "@/lib/api";
import type { UnitSystem } from "@/constants/settings";

export type SettingsDto = {
  unitSystem: UnitSystem;
  keepScreenOn: boolean;
};

export async function getSettings() {
  return apiFetch("/api/v1/settings") as Promise<SettingsDto>;
}

export async function updateSettings(body: {
  unitSystem: UnitSystem;
  keepScreenOn: boolean;
}) {
  return apiFetch("/api/v1/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  }) as Promise<SettingsDto>;
}
