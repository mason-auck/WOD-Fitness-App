import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { toDateKeyFromDate } from "@/constants/calendar";
import {
  INITIAL_EXERCISES,
  type Exercise,
  type PersonalRecord,
  exerciseToPersonalRecord,
} from "@/constants/personal-records";

type ExercisesContextType = {
  exercises: Exercise[];
  personalRecords: PersonalRecord[];
  getExercise: (id: string) => Exercise | undefined;
  addExercise: (name: string) => string;
  renameExercise: (id: string, name: string) => void;
  deleteExercise: (id: string) => void;
  logPr: (
    id: string,
    value: string,
    options?: { notes?: string; dateKey?: string },
  ) => void;
};

const ExercisesContext = createContext<ExercisesContextType | null>(null);

export function ExercisesProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);

  const personalRecords = useMemo(
    () => exercises.map(exerciseToPersonalRecord),
    [exercises],
  );

  const getExercise = useCallback(
    (id: string) => exercises.find((exercise) => exercise.id === id),
    [exercises],
  );

  const addExercise = useCallback((name: string) => {
    const id = Date.now().toString();
    const exercise: Exercise = {
      id,
      name: name.trim(),
      category: "Custom",
      history: [],
    };

    setExercises((current) => [...current, exercise]);
    return id;
  }, []);

  const renameExercise = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === id ? { ...exercise, name: trimmed } : exercise,
      ),
    );
  }, []);

  const deleteExercise = useCallback((id: string) => {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  }, []);

  const logPr = useCallback(
    (
      id: string,
      value: string,
      options?: { notes?: string; dateKey?: string },
    ) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      const entry = {
        id: Date.now().toString(),
        value: trimmed,
        dateKey: options?.dateKey ?? toDateKeyFromDate(new Date()),
        notes: options?.notes?.trim() || undefined,
      };

      setExercises((current) =>
        current.map((exercise) =>
          exercise.id === id
            ? { ...exercise, history: [entry, ...exercise.history] }
            : exercise,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      exercises,
      personalRecords,
      getExercise,
      addExercise,
      renameExercise,
      deleteExercise,
      logPr,
    }),
    [
      exercises,
      personalRecords,
      getExercise,
      addExercise,
      renameExercise,
      deleteExercise,
      logPr,
    ],
  );

  return (
    <ExercisesContext.Provider value={value}>
      {children}
    </ExercisesContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error("useExercises must be used within ExercisesProvider");
  }
  return context;
}
