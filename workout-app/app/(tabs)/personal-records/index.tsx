import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { KeyboardSheet } from "@/components/keyboard-sheet";
import { KeyboardScreen } from "@/components/keyboard-screen";
import { BottomSheetInput } from "@/components/modal-keyboard-frame";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ExerciseDto,
  getPersonalRecords,
  createExercise,
} from "@/lib/api/exercise-api";
import { Layout } from "@/constants/theme";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function PersonalRecordsScreen() {
  const { colors, styles } = useAppStyles();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);

  // load personal records when the component starts
  useEffect(() => {
    let cancelled = false;

    async function loadPersonalRecords() {
      try {
        const data = await getPersonalRecords();
        if (!cancelled) {
          setExercises(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setExercises([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPersonalRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return exercises;

    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
    );
  }, [exercises, searchQuery]);

  const handleCreateExercise = async () => {
    const name = newExerciseName.trim();
    if (!name) {
      alert("Please enter an exercise name.");
      return;
    }

    try {
      const created = await createExercise({ name });
      setExercises((prev) => [...prev, created]);
      setShowCreateModal(false);
      setNewExerciseName("");
      router.push(`/personal-records/${created.id}` as Href);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Could not create exercise",
      );
    }
  };

  return (
    <ThemedView style={styles.page}>
      <KeyboardScreen
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        <ThemedText style={styles.listLabel}>
          Track PRs for lifts, cardio, benchmarks, and more.
        </ThemedText>

        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={Layout.iconSm}
            color={colors.icon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <MaterialIcons name="close" size={20} color={colors.icon} />
            </Pressable>
          )}
        </View>

        <ThemedText type="defaultSemiBold" style={styles.listLabel}>
          {filteredExercises.length} exercise
          {filteredExercises.length === 1 ? "" : "s"}
        </ThemedText>

        {filteredExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No exercises match your search.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listGapSm}>
            {filteredExercises.map((exercise) => {
              return (
                <Pressable
                  key={exercise.id}
                  style={styles.listCard}
                  onPress={() =>
                    router.push(`/personal-records/${exercise.id}` as Href)
                  }
                >
                  <View style={styles.calendarLogInfo}>
                    <ThemedText type="defaultSemiBold">
                      {exercise.name}
                    </ThemedText>
                    <ThemedText style={styles.activityDate}>
                      {exercise.category}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.calendarLogScore}>
                    {exercise.currentPr ?? "—"}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </KeyboardScreen>

      <Pressable
        style={styles.calendarFab}
        onPress={() => setShowCreateModal(true)}
        accessibilityLabel="Create exercise"
      >
        <MaterialIcons name="add" size={28} color={colors.onAccent} />
      </Pressable>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          setNewExerciseName("");
        }}
      >
        <KeyboardSheet
          onDismiss={() => {
            setShowCreateModal(false);
            setNewExerciseName("");
          }}
        >
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            New Exercise
          </ThemedText>
          <ThemedText style={styles.listLabel}>
            Name the movement you want to track.
          </ThemedText>

          <ThemedText style={styles.fieldLabel}>Exercise name</ThemedText>
          <BottomSheetInput
            style={styles.input}
            placeholder="e.g. Bench Press, 1 Mile Run"
            placeholderTextColor={colors.icon}
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreateExercise}
          />

          <Pressable
            style={styles.buttonPrimary}
            onPress={handleCreateExercise}
          >
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              Create & Open
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.buttonCancel}
            onPress={() => {
              setShowCreateModal(false);
              setNewExerciseName("");
            }}
          >
            <ThemedText style={styles.textMuted}>Cancel</ThemedText>
          </Pressable>
        </KeyboardSheet>
      </Modal>
    </ThemedView>
  );
}
