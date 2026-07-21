import { apiFetch } from "@/lib/api";

export type ExerciseDto = {
  id: string;
  name: string;
  category: string;
  currentPr: string | null;
  history?: PrLogEntryDto[];
};

export type PrLogEntryDto = {
  id: string;
  value: string;
  dateKey: string;
  notes?: string | null;
};

// get all personal records for the logged in user
export async function getPersonalRecords() {
  return apiFetch("/api/v1/exercises") as Promise<ExerciseDto[]>;
}

// get individual personal record by id
export async function getPersonalRecordById(id: string) {
  return apiFetch(`/api/v1/exercises/${id}`) as Promise<ExerciseDto>;
}

// create a new personal record
export async function createExercise(body: {
  name: string;
  category?: string;
}) {
  return apiFetch("/api/v1/exercises", {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<ExerciseDto>;
}

export async function renameExercise(id: string, name: string) {
  return apiFetch(`/api/v1/exercises/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  }) as Promise<ExerciseDto>;
}

export async function deleteExercise(id: string) {
  return apiFetch(`/api/v1/exercises/${id}`, {
    method: "DELETE",
  }) as Promise<null>;
}

export async function logPr(
  id: string,
  body: { value: string; notes?: string; loggedOn?: string },
) {
  return apiFetch(`/api/v1/exercises/${id}/entries`, {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<PrLogEntryDto>;
}
