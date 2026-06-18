import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { KeyboardSheet } from "@/components/keyboard-sheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getCurrentPr } from "@/constants/personal-records";
import { Layout } from "@/constants/theme";
import { useExercises } from "@/contexts/exercises-context";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function PersonalRecordsScreen() {
  const { colors, styles } = useAppStyles();
  const router = useRouter();
  const { exercises, addExercise } = useExercises();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return exercises;

    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
    );
  }, [exercises, searchQuery]);

  const handleCreateExercise = () => {
    const name = newExerciseName.trim();
    if (!name) {
      alert("Please enter an exercise name.");
      return;
    }

    const id = addExercise(name);
    setShowCreateModal(false);
    setNewExerciseName("");
    router.push(`/personal-records/${id}` as Href);
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={styles.listLabel}>
          Track PRs for lifts, cardio, benchmarks, and more.
        </ThemedText>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={Layout.iconSm} color={colors.icon} />
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
              const currentPr = getCurrentPr(exercise);

              return (
                <Pressable
                  key={exercise.id}
                  style={styles.listCard}
                  onPress={() =>
                    router.push(`/personal-records/${exercise.id}` as Href)
                  }
                >
                  <View style={styles.calendarLogInfo}>
                    <ThemedText type="defaultSemiBold">{exercise.name}</ThemedText>
                    <ThemedText style={styles.activityDate}>
                      {exercise.category}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.calendarLogScore}>
                    {currentPr ?? "—"}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

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
          <TextInput
            style={styles.input}
            placeholder="e.g. Bench Press, 1 Mile Run"
            placeholderTextColor={colors.icon}
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            autoFocus
          />

          <Pressable style={styles.buttonPrimary} onPress={handleCreateExercise}>
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
