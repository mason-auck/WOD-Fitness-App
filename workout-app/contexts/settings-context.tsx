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
import { useAuth } from "@/contexts/auth-context";
import { getSettings, updateSettings } from "@/lib/api/settings-api";

const KEEP_AWAKE_TAG = "workout-app-keep-awake";

type SettingsContextType = {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  weightUnitLabel: string;
  weightUnitName: string;
  keepScreenOn: boolean;
  setKeepScreenOn: (enabled: boolean) => void;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("imperial");
  const [keepScreenOn, setKeepScreenOnState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const settings = await getSettings();
        if (cancelled) return;
        setUnitSystemState(settings.unitSystem);
        setKeepScreenOnState(settings.keepScreenOn);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!keepScreenOn) return;

    void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    return () => {
      void deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, [keepScreenOn]);

  const persist = useCallback(
    async (next: { unitSystem: UnitSystem; keepScreenOn: boolean }) => {
      try {
        const saved = await updateSettings(next);
        setUnitSystemState(saved.unitSystem);
        setKeepScreenOnState(saved.keepScreenOn);
      } catch (error) {
        console.error("Error saving settings:", error);
        alert(
          error instanceof Error ? error.message : "Could not save settings",
        );
        try {
          const settings = await getSettings();
          setUnitSystemState(settings.unitSystem);
          setKeepScreenOnState(settings.keepScreenOn);
        } catch {
          /* ignore reload failure */
        }
      }
    },
    [],
  );

  const setUnitSystem = useCallback(
    (system: UnitSystem) => {
      setUnitSystemState(system);
      void persist({ unitSystem: system, keepScreenOn });
    },
    [keepScreenOn, persist],
  );

  const setKeepScreenOn = useCallback(
    (enabled: boolean) => {
      setKeepScreenOnState(enabled);
      void persist({ unitSystem, keepScreenOn: enabled });
    },
    [unitSystem, persist],
  );

  const value = useMemo(
    () => ({
      unitSystem,
      setUnitSystem,
      weightUnitLabel: getWeightUnitLabel(unitSystem),
      weightUnitName: getWeightUnitName(unitSystem),
      keepScreenOn,
      setKeepScreenOn,
      loading,
    }),
    [
      unitSystem,
      setUnitSystem,
      keepScreenOn,
      setKeepScreenOn,
      loading,
    ],
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
