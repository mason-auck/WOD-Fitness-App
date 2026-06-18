import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getWeightUnitLabel,
  getWeightUnitName,
  type UnitSystem,
} from "@/constants/settings";

const KEEP_AWAKE_TAG = "workout-app-keep-awake";

type SettingsContextType = {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  weightUnitLabel: string;
  weightUnitName: string;
  keepScreenOn: boolean;
  setKeepScreenOn: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("imperial");
  const [keepScreenOn, setKeepScreenOnState] = useState(false);

  useEffect(() => {
    if (!keepScreenOn) return;

    void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    return () => {
      void deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, [keepScreenOn]);

  const setUnitSystem = useCallback((system: UnitSystem) => {
    setUnitSystemState(system);
  }, []);

  const setKeepScreenOn = useCallback((enabled: boolean) => {
    setKeepScreenOnState(enabled);
  }, []);

  const value = useMemo(
    () => ({
      unitSystem,
      setUnitSystem,
      weightUnitLabel: getWeightUnitLabel(unitSystem),
      weightUnitName: getWeightUnitName(unitSystem),
      keepScreenOn,
      setKeepScreenOn,
    }),
    [unitSystem, setUnitSystem, keepScreenOn, setKeepScreenOn],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
