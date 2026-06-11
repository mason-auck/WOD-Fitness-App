import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import {
  formatTimerDisplay,
  getTimerTypeLabel,
  type TimerConfig,
} from "@/constants/timer";
import { useAppStyles } from "@/hooks/use-app-styles";

type TimerPhase = "idle" | "countdown" | "running" | "finished";

type TabataPhase = "work" | "rest";

type Props = {
  visible: boolean;
  config: TimerConfig;
  onClose: () => void;
};

export function FullScreenTimer({ visible, config, onClose }: Props) {
  const { colors, styles } = useAppStyles();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [countdownValue, setCountdownValue] = useState(5);
  const [reps, setReps] = useState(0);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [amrapSecondsLeft, setAmrapSecondsLeft] = useState(
    config.amrapMinutes * 60,
  );
  const [tabataRound, setTabataRound] = useState(1);
  const [tabataPhase, setTabataPhase] = useState<TabataPhase>("work");
  const [tabataPhaseSecondsLeft, setTabataPhaseSecondsLeft] = useState(
    config.tabataWorkSeconds,
  );
  const [emomRound, setEmomRound] = useState(1);
  const [emomSecondsLeft, setEmomSecondsLeft] = useState(
    config.emomIntervalMinutes * 60,
  );

  const tabataRoundRef = useRef(1);
  const tabataPhaseRef = useRef<TabataPhase>("work");
  const emomRoundRef = useRef(1);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const resetTimerState = useCallback(() => {
    clearTick();
    setPhase("idle");
    setCountdownValue(5);
    setReps(0);
    setElapsedSeconds(0);
    setAmrapSecondsLeft(config.amrapMinutes * 60);
    setTabataRound(1);
    setTabataPhase("work");
    setTabataPhaseSecondsLeft(config.tabataWorkSeconds);
    setEmomRound(1);
    setEmomSecondsLeft(config.emomIntervalMinutes * 60);
    tabataRoundRef.current = 1;
    tabataPhaseRef.current = "work";
    emomRoundRef.current = 1;
  }, [clearTick, config]);

  useEffect(() => {
    if (!visible) {
      resetTimerState();
    }
  }, [visible, resetTimerState]);

  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdownValue <= 0) {
      setPhase("running");
      return;
    }

    const timeout = setTimeout(() => {
      setCountdownValue((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phase, countdownValue]);

  const finishTimer = useCallback(() => {
    clearTick();
    setPhase("finished");
  }, [clearTick]);

  useEffect(() => {
    if (phase !== "running") return;

    tickRef.current = setInterval(() => {
      if (config.type === "stopwatch") {
        setElapsedSeconds((value) => value + 1);
        return;
      }

      if (config.type === "amrap") {
        setAmrapSecondsLeft((value) => {
          if (value <= 1) {
            finishTimer();
            return 0;
          }
          return value - 1;
        });
        return;
      }

      if (config.type === "tabata") {
        setTabataPhaseSecondsLeft((value) => {
          if (value > 1) return value - 1;

          const round = tabataRoundRef.current;
          const phase = tabataPhaseRef.current;

          if (phase === "work") {
            if (config.tabataRestSeconds > 0) {
              tabataPhaseRef.current = "rest";
              setTabataPhase("rest");
              return config.tabataRestSeconds;
            }

            if (round >= config.tabataRounds) {
              finishTimer();
              return 0;
            }

            tabataRoundRef.current = round + 1;
            setTabataRound(round + 1);
            return config.tabataWorkSeconds;
          }

          if (round >= config.tabataRounds) {
            finishTimer();
            return 0;
          }

          tabataRoundRef.current = round + 1;
          tabataPhaseRef.current = "work";
          setTabataRound(round + 1);
          setTabataPhase("work");
          return config.tabataWorkSeconds;
        });
        return;
      }

      if (config.type === "emom") {
        setEmomSecondsLeft((value) => {
          if (value > 1) return value - 1;

          const round = emomRoundRef.current;
          if (round >= config.emomRounds) {
            finishTimer();
            return 0;
          }

          emomRoundRef.current = round + 1;
          setEmomRound(round + 1);
          return config.emomIntervalMinutes * 60;
        });
      }
    }, 1000);

    return clearTick;
  }, [phase, config, finishTimer, clearTick]);

  const handleStart = () => {
    if (phase === "finished") {
      resetTimerState();
      return;
    }

    setCountdownValue(5);
    setPhase("countdown");
  };

  const handleFinish = () => {
    if (phase === "countdown") {
      resetTimerState();
      return;
    }

    finishTimer();
  };

  const handleClose = () => {
    resetTimerState();
    onClose();
  };

  const isRunning = phase === "running";

  const mainDisplay = (() => {
    if (phase === "countdown") {
      return countdownValue > 0 ? String(countdownValue) : "GO!";
    }

    if (phase === "finished") {
      if (config.type === "stopwatch") {
        return formatTimerDisplay(elapsedSeconds);
      }
      if (config.type === "amrap") {
        return "0:00";
      }
      return "Done";
    }

    switch (config.type) {
      case "stopwatch":
        return formatTimerDisplay(elapsedSeconds);
      case "amrap":
        return formatTimerDisplay(amrapSecondsLeft);
      case "tabata":
        return formatTimerDisplay(tabataPhaseSecondsLeft);
      case "emom":
        return formatTimerDisplay(emomSecondsLeft);
    }
  })();

  const displayLabel = (() => {
    if (phase === "countdown") return "Get Ready";
    if (phase === "finished") return "Finished";

    switch (config.type) {
      case "stopwatch":
        return "Elapsed";
      case "amrap":
        return "Time Remaining";
      case "tabata":
        return tabataPhase === "work" ? "WORK" : "REST";
      case "emom":
        return "EMOM";
    }
  })();

  const metaLines = (() => {
    if (phase === "countdown" || phase === "idle") {
      return [getTimerTypeLabel(config.type)];
    }

    if (phase === "finished") {
      return [`${reps} rep${reps === 1 ? "" : "s"} logged`];
    }

    switch (config.type) {
      case "stopwatch":
        return ["Counting up"];
      case "amrap":
        return [`${config.amrapMinutes} minute cap`];
      case "tabata":
        return [
          `Round ${tabataRound} of ${config.tabataRounds}`,
          `${config.tabataWorkSeconds}s work / ${config.tabataRestSeconds}s rest`,
        ];
      case "emom":
        return [
          `Round ${emomRound} of ${config.emomRounds}`,
          `${config.emomIntervalMinutes} min intervals`,
        ];
    }
  })();

  const actionLabel = (() => {
    if (phase === "idle") return "Start";
    if (phase === "countdown") return "Cancel";
    if (phase === "running") return "Finish";
    return "Reset";
  })();

  const onActionPress = (() => {
    if (phase === "idle") return handleStart;
    if (phase === "countdown") return handleFinish;
    if (phase === "running") return handleFinish;
    return handleStart;
  })();

  const actionStyle =
    phase === "running" || phase === "countdown"
      ? styles.timerActionFinish
      : styles.timerActionStart;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.timerFullScreen,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.timerFullScreenHeader}>
          <ThemedText type="subtitle">
            {getTimerTypeLabel(config.type)}
          </ThemedText>
          <Pressable onPress={handleClose} hitSlop={12}>
            <MaterialIcons name="close" size={28} color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.timerDisplayArea}>
          <ThemedText
            style={[
              styles.timerPhaseLabel,
              phase === "running" &&
                config.type === "tabata" &&
                (tabataPhase === "work"
                  ? styles.timerPhaseWork
                  : styles.timerPhaseRest),
            ]}
          >
            {displayLabel}
          </ThemedText>

          <Text style={styles.timerMainDisplay}>{mainDisplay}</Text>

          {metaLines.map((line) => (
            <ThemedText key={line} style={styles.timerMetaText}>
              {line}
            </ThemedText>
          ))}
        </View>

        <View style={styles.timerBottomPanel}>
          <View style={styles.timerRepRow}>
            <Pressable
              style={[
                styles.timerRepButton,
                !isRunning && styles.timerRepButtonDisabled,
              ]}
              onPress={() => setReps((value) => Math.max(0, value - 1))}
              disabled={!isRunning}
              accessibilityLabel="Subtract rep"
            >
              <Text style={styles.timerRepButtonText}>−</Text>
            </Pressable>

            <View style={styles.timerRepCountGroup}>
              <Text style={styles.timerRepValue}>{reps}</Text>
              <ThemedText style={styles.timerRepLabel}>REPS</ThemedText>
            </View>

            <Pressable
              style={[
                styles.timerRepButton,
                !isRunning && styles.timerRepButtonDisabled,
              ]}
              onPress={() => setReps((value) => value + 1)}
              disabled={!isRunning}
              accessibilityLabel="Add rep"
            >
              <Text style={styles.timerRepButtonText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.timerActionButton, actionStyle]}
            onPress={onActionPress}
          >
            <Text style={styles.timerActionButtonText}>{actionLabel}</Text>
          </Pressable>

          {phase === "finished" && (
            <Pressable style={styles.buttonCancel} onPress={handleClose}>
              <ThemedText style={styles.textMuted}>Close Timer</ThemedText>
            </Pressable>
          )}
        </View>

        {phase === "countdown" && countdownValue > 0 && (
          <View style={styles.timerCountdownOverlay} pointerEvents="none">
            <Text style={styles.timerCountdownText}>{countdownValue}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
