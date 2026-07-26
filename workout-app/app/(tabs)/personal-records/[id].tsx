import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
  type Href,
} from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { Layout } from "@/constants/theme";
import {
  deleteExercise,
  getPersonalRecordById,
  logPr,
  renameExercise,
  type ExerciseDto,
} from "@/lib/api/exercise-api";
import { useAppStyles } from "@/hooks/use-app-styles";

type ActionModal = "log" | "rename" | null;

export default function ExerciseDetailScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, styles } = useAppStyles();
  const fromWorkouts = from === "workouts";

  const [exercise, setExercise] = useState<ExerciseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [valueInput, setValueInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [renameInput, setRenameInput] = useState("");

  const goBack = () => {
    if (fromWorkouts) {
      router.replace("/workouts?tab=strength" as Href);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/personal-records" as Href);
  };

  useEffect(() => {
    let cancelled = false;
    if (!id) return;

    async function loadExercise() {
      setLoading(true);
      try {
        const data = await getPersonalRecordById(id);
        if (!cancelled) {
          setExercise(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setExercise(null);
          goBack();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExercise();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when id changes
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      title: exercise?.name ?? "Exercise",
      headerBackTitleVisible: false,
      headerBackButtonDisplayMode: "minimal",
      headerLeft: (props: object) => (
        <HeaderBackButton
          {...props}
          tintColor={colors.text}
          label=""
          labelVisible={false}
          onPress={goBack}
        />
      ),
    });
  }, [exercise, navigation, colors.text, fromWorkouts]);

  const sortedHistory = useMemo(() => {
    if (!exercise?.history) return [];
    return [...exercise.history].sort((a, b) =>
      String(b.dateKey).localeCompare(String(a.dateKey)),
    );
  }, [exercise]);

  const openLogModal = () => {
    setValueInput(exercise?.currentPr ?? "");
    setNotesInput("");
    setActionModal("log");
  };

  const openRenameModal = () => {
    if (!exercise) return;
    setRenameInput(exercise.name);
    setActionModal("rename");
  };

  const handleLogPr = async () => {
    if (!exercise) return;
    const value = valueInput.trim();
    if (!value) {
      alert("Please enter a value.");
      return;
    }

    setSaving(true);
    try {
      const notes = notesInput.trim();
      await logPr(exercise.id, {
        value,
        ...(notes ? { notes } : {}),
      });
      const refreshed = await getPersonalRecordById(exercise.id);
      setExercise(refreshed);
      setActionModal(null);
      setValueInput("");
      setNotesInput("");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Could not log PR");
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async () => {
    if (!exercise) return;
    const name = renameInput.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }

    setSaving(true);
    try {
      const updated = await renameExercise(exercise.id, name);
      setExercise(updated);
      setActionModal(null);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Could not rename exercise");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!exercise) return;

    Alert.alert(
      "Delete exercise?",
      `"${exercise.name}" and all of its PR history will be removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExercise(exercise.id);
              goBack();
            } catch (error) {
              console.error(error);
              alert(
                error instanceof Error
                  ? error.message
                  : "Could not delete exercise",
              );
            }
          },
        },
      ],
    );
  };

  const closeModal = () => {
    if (saving) return;
    setActionModal(null);
    setValueInput("");
    setNotesInput("");
    setRenameInput("");
  };

  if (loading) {
    return (
      <ThemedView style={[styles.page, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </ThemedView>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.feedScoreBox}>
          <ThemedText style={styles.feedScoreValue}>
            {exercise.currentPr ?? "No PR yet"}
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
                    {formatSelectedDate(String(entry.dateKey))}
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
            editable={!saving}
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
            editable={!saving}
          />

          <Pressable
            style={[styles.buttonPrimary, saving && { opacity: 0.6 }]}
            onPress={handleLogPr}
            disabled={saving}
          >
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              {saving ? "Saving…" : "Save PR"}
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
            editable={!saving}
          />

          <Pressable
            style={[styles.buttonPrimary, saving && { opacity: 0.6 }]}
            onPress={handleRename}
            disabled={saving}
          >
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              {saving ? "Saving…" : "Save Name"}
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
