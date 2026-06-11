import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FullScreenTimer } from "@/components/full-screen-timer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  DEFAULT_TIMER_CONFIG,
  TIMER_TYPES,
  type TimerConfig,
  type TimerType,
} from "@/constants/timer";
import { useAppStyles } from "@/hooks/use-app-styles";

type StepperProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function TimerStepper({ label, value, unit, min, max, onChange }: StepperProps) {
  const { styles } = useAppStyles();

  return (
    <View style={styles.timerStepperRow}>
      <ThemedText style={styles.timerStepperLabel}>{label}</ThemedText>
      <View style={styles.timerStepperControls}>
        <Pressable
          style={styles.timerStepperButton}
          onPress={() => onChange(Math.max(min, value - 1))}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={styles.timerRepButtonText}>−</Text>
        </Pressable>
        <ThemedText style={styles.timerStepperValue}>
          {value} {unit}
        </ThemedText>
        <Pressable
          style={styles.timerStepperButton}
          onPress={() => onChange(Math.min(max, value + 1))}
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={styles.timerRepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TimerTypeSettings({
  type,
  config,
  onUpdate,
}: {
  type: TimerType;
  config: TimerConfig;
  onUpdate: <K extends keyof TimerConfig>(key: K, value: TimerConfig[K]) => void;
}) {
  const { styles } = useAppStyles();

  if (type === "stopwatch") return null;

  return (
    <View style={styles.card}>
      {type === "amrap" && (
        <TimerStepper
          label="Duration"
          value={config.amrapMinutes}
          unit="min"
          min={1}
          max={60}
          onChange={(value) => onUpdate("amrapMinutes", value)}
        />
      )}

      {type === "tabata" && (
        <>
          <TimerStepper
            label="Work"
            value={config.tabataWorkSeconds}
            unit="sec"
            min={5}
            max={120}
            onChange={(value) => onUpdate("tabataWorkSeconds", value)}
          />
          <TimerStepper
            label="Rest"
            value={config.tabataRestSeconds}
            unit="sec"
            min={0}
            max={120}
            onChange={(value) => onUpdate("tabataRestSeconds", value)}
          />
          <TimerStepper
            label="Rounds"
            value={config.tabataRounds}
            unit="rounds"
            min={1}
            max={30}
            onChange={(value) => onUpdate("tabataRounds", value)}
          />
        </>
      )}

      {type === "emom" && (
        <>
          <TimerStepper
            label="Interval"
            value={config.emomIntervalMinutes}
            unit="min"
            min={1}
            max={5}
            onChange={(value) => onUpdate("emomIntervalMinutes", value)}
          />
          <TimerStepper
            label="Rounds"
            value={config.emomRounds}
            unit="rounds"
            min={1}
            max={60}
            onChange={(value) => onUpdate("emomRounds", value)}
          />
        </>
      )}
    </View>
  );
}

export default function TimerScreen() {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [showTimer, setShowTimer] = useState(false);

  const setType = (type: TimerType) => {
    setConfig((current) => ({ ...current, type }));
  };

  const updateConfig = <K extends keyof TimerConfig>(
    key: K,
    value: TimerConfig[K],
  ) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.timerSetupScroll}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="subtitle">Timer</ThemedText>
        <ThemedText style={styles.listLabel}>Select a timer type.</ThemedText>

        <View style={styles.timerTypeList}>
          {TIMER_TYPES.map((timerType) => {
            const selected = config.type === timerType.type;

            return (
              <View key={timerType.type} style={styles.timerTypeGroup}>
                <Pressable
                  style={[
                    styles.timerTypeCard,
                    selected
                      ? styles.timerTypeCardSelected
                      : styles.timerTypeCardUnselected,
                  ]}
                  onPress={() => setType(timerType.type)}
                >
                  <ThemedText type="defaultSemiBold">{timerType.label}</ThemedText>
                  {selected && (
                    <ThemedText style={styles.timerTypeDescription}>
                      {timerType.description}
                    </ThemedText>
                  )}
                </Pressable>

                {selected && (
                  <TimerTypeSettings
                    type={timerType.type}
                    config={config}
                    onUpdate={updateConfig}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.timerSetupFooter,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={styles.timerStartButton}
          onPress={() => setShowTimer(true)}
        >
          <Text style={styles.timerStartButtonText}>Start Timer</Text>
        </Pressable>
      </View>

      <FullScreenTimer
        visible={showTimer}
        config={config}
        onClose={() => setShowTimer(false)}
      />
    </ThemedView>
  );
}
