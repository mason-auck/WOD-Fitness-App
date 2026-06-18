import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { INITIAL_CALENDAR_LOGS } from "@/constants/calendar";
import {
  XP_PER_PR,
  XP_PER_WOD,
  computeInitialXp,
  getSkillProgress,
  type SkillProgress,
} from "@/constants/skill-level";
import { INITIAL_EXERCISES } from "@/constants/personal-records";

type ProgressContextType = {
  totalXp: number;
  wodsLogged: number;
  prsLogged: number;
  skillProgress: SkillProgress;
  awardWodXp: () => void;
  awardPrXp: () => void;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

function countInitialActivity() {
  const wodsLogged = INITIAL_CALENDAR_LOGS.filter((log) => log.kind === "wod").length;
  const prsLogged = INITIAL_EXERCISES.reduce(
    (sum, exercise) => sum + exercise.history.length,
    0,
  );

  return { wodsLogged, prsLogged };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const initialActivity = useMemo(() => countInitialActivity(), []);

  const [totalXp, setTotalXp] = useState(computeInitialXp);
  const [wodsLogged, setWodsLogged] = useState(initialActivity.wodsLogged);
  const [prsLogged, setPrsLogged] = useState(initialActivity.prsLogged);

  const skillProgress = useMemo(() => getSkillProgress(totalXp), [totalXp]);

  const awardWodXp = useCallback(() => {
    setTotalXp((current) => current + XP_PER_WOD);
    setWodsLogged((current) => current + 1);
  }, []);

  const awardPrXp = useCallback(() => {
    setTotalXp((current) => current + XP_PER_PR);
    setPrsLogged((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      totalXp,
      wodsLogged,
      prsLogged,
      skillProgress,
      awardWodXp,
      awardPrXp,
    }),
    [totalXp, wodsLogged, prsLogged, skillProgress, awardWodXp, awardPrXp],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
