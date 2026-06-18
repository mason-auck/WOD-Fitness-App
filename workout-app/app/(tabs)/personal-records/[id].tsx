import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { KeyboardSheet } from "@/components/keyboard-sheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatSelectedDate } from "@/constants/calendar";
import { getCurrentPr } from "@/constants/personal-records";
import { Layout } from "@/constants/theme";
import { useExercises } from "@/contexts/exercises-context";
import { useProgress } from "@/contexts/progress-context";
import { useAppStyles } from "@/hooks/use-app-styles";

type ActionModal = "log" | "rename" | null;

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, styles } = useAppStyles();
  const { getExercise, logPr, renameExercise, deleteExercise } = useExercises();
  const { awardPrXp } = useProgress();

  const exercise = getExercise(id);

  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [valueInput, setValueInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [renameInput, setRenameInput] = useState("");

  const currentPr = useMemo(
    () => (exercise ? getCurrentPr(exercise) : null),
    [exercise],
  );

  const sortedHistory = useMemo(() => {
    if (!exercise) return [];
    return [...exercise.history].sort((a, b) =>
      b.dateKey.localeCompare(a.dateKey),
    );
  }, [exercise]);

  useEffect(() => {
    if (exercise) {
      navigation.setOptions({ title: exercise.name });
    }
  }, [exercise, navigation]);

  useEffect(() => {
    if (!exercise) {
      router.replace("/personal-records");
    }
  }, [exercise, router]);

  if (!exercise) {
    return null;
  }

  const openLogModal = () => {
    setValueInput(currentPr ?? "");
    setNotesInput("");
    setActionModal("log");
  };

  const openRenameModal = () => {
    setRenameInput(exercise.name);
    setActionModal("rename");
  };

  const handleLogPr = () => {
    const value = valueInput.trim();
    if (!value) {
      alert("Please enter a value.");
      return;
    }

    logPr(exercise.id, value, { notes: notesInput });
    awardPrXp();
    setActionModal(null);
    setValueInput("");
    setNotesInput("");
  };

  const handleRename = () => {
    const name = renameInput.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }

    renameExercise(exercise.id, name);
    setActionModal(null);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete exercise?",
      `"${exercise.name}" and all of its PR history will be removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExercise(exercise.id);
            router.replace("/personal-records");
          },
        },
      ],
    );
  };

  const closeModal = () => {
    setActionModal(null);
    setValueInput("");
    setNotesInput("");
    setRenameInput("");
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.feedScoreBox}>
          <ThemedText style={styles.feedScoreValue}>
            {currentPr ?? "No PR yet"}
          </ThemedText>
          <ThemedText style={styles.feedScoreLabel}>Current PR</ThemedText>
        </View>

        <ThemedText style={styles.activityDate}>{exercise.category}</ThemedText>

        <Pressable style={styles.buttonPrimary} onPress={openLogModal}>
          <ThemedText
            lightColor={colors.onAccent}
            darkColor={colors.onAccent}
            style={styles.buttonPrimaryText}
          >
            Log Personal Record
          </ThemedText>
        </Pressable>

        <Pressable style={styles.buttonOutline} onPress={openRenameModal}>
          <MaterialIcons name="edit" size={Layout.iconSm} color={colors.accent} />
          <ThemedText style={styles.buttonOutlineText}>Rename Exercise</ThemedText>
        </Pressable>

        <Pressable style={styles.buttonDanger} onPress={handleDelete}>
          <ThemedText style={styles.textDanger}>Delete Exercise</ThemedText>
        </Pressable>

        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          History
        </ThemedText>

        {sortedHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No PRs logged yet. Tap Log Personal Record to add one.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listGapSm}>
            {sortedHistory.map((entry) => (
              <View key={entry.id} style={styles.calendarLogCard}>
                <View style={styles.calendarLogHeader}>
                  <ThemedText type="defaultSemiBold">{entry.value}</ThemedText>
                  <ThemedText style={styles.activityDate}>
                    {formatSelectedDate(entry.dateKey)}
                  </ThemedText>
                </View>
                {entry.notes ? (
                  <ThemedText style={styles.feedNotes}>{entry.notes}</ThemedText>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={actionModal === "log"}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardSheet onDismiss={closeModal}>
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Log PR — {exercise.name}
          </ThemedText>

          <ThemedText style={styles.fieldLabel}>Value</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g. 230 lbs, 6:30, 20 reps"
            placeholderTextColor={colors.icon}
            value={valueInput}
            onChangeText={setValueInput}
          />

          <ThemedText style={styles.fieldLabel}>Notes (optional)</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="How it felt, conditions, etc."
            placeholderTextColor={colors.icon}
            value={notesInput}
            onChangeText={setNotesInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Pressable style={styles.buttonPrimary} onPress={handleLogPr}>
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              Save PR
            </ThemedText>
          </Pressable>

          <Pressable style={styles.buttonCancel} onPress={closeModal}>
            <ThemedText style={styles.textMuted}>Cancel</ThemedText>
          </Pressable>
        </KeyboardSheet>
      </Modal>

      <Modal
        visible={actionModal === "rename"}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardSheet onDismiss={closeModal}>
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Rename Exercise
          </ThemedText>

          <ThemedText style={styles.fieldLabel}>Exercise name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Exercise name"
            placeholderTextColor={colors.icon}
            value={renameInput}
            onChangeText={setRenameInput}
            autoFocus
          />

          <Pressable style={styles.buttonPrimary} onPress={handleRename}>
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              Save Name
            </ThemedText>
          </Pressable>

          <Pressable style={styles.buttonCancel} onPress={closeModal}>
            <ThemedText style={styles.textMuted}>Cancel</ThemedText>
          </Pressable>
        </KeyboardSheet>
      </Modal>
    </ThemedView>
  );
}
