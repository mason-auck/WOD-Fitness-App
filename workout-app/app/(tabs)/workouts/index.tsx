import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, TextInput, View } from "react-native";

import { KeyboardSheet } from "@/components/keyboard-sheet";
import { KeyboardScreen } from "@/components/keyboard-screen";
import {
  BottomSheetInput,
  ModalFormScroll,
  ModalKeyboardFrame,
} from "@/components/modal-keyboard-frame";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  WOD_CATEGORIES,
  WOD_TYPES,
  type Wod,
  type WodCategory,
  type WodType,
} from "@/constants/wods";
import { Layout } from "@/constants/theme";
import {
  createExercise,
  getPersonalRecords,
  type ExerciseDto,
} from "@/lib/api/exercise-api";
import { createWod, getWods } from "@/lib/api/wods-api";
import { useAppStyles } from "@/hooks/use-app-styles";

type WorkoutTab = "wods" | "strength";
type WodFilter = "Favorites" | WodType | WodCategory;

const SCORING_TYPE_FILTERS: WodType[] = WOD_TYPES;

const FILTER_SECTIONS: { title: string; filters: WodFilter[] }[] = [
  { title: "Other", filters: ["Favorites"] },
  { title: "Scoring Type", filters: SCORING_TYPE_FILTERS },
  { title: "Category", filters: WOD_CATEGORIES },
];

/** Strength = lifts / accessories, not cardio / gymnastics / benchmarks. */
const STRENGTH_CATEGORIES = new Set(["Weightlifting", "Custom"]);

function wodMatchesFilter(wod: Wod, filter: WodFilter): boolean {
  if (filter === "Favorites") return wod.favorited;
  if (WOD_TYPES.includes(filter as WodType)) return wod.type === filter;
  return wod.category === filter;
}

export default function WorkoutsScreen() {
  const { colors, styles } = useAppStyles();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<WorkoutTab>("wods");

  // Support deep-link / return from strength detail: /workouts?tab=strength
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  useEffect(() => {
    if (tabParam === "strength") {
      setActiveTab("strength");
    }
  }, [tabParam]);

  const [wods, setWods] = useState<Wod[]>([]);
  const [wodsLoading, setWodsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<WodFilter[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<WodType>("For Time");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [strengthLoading, setStrengthLoading] = useState(true);
  const [strengthSearch, setStrengthSearch] = useState("");
  const [showCreateStrength, setShowCreateStrength] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [creatingStrength, setCreatingStrength] = useState(false);

  const loadWods = useCallback(async () => {
    try {
      const data = await getWods();
      setWods(data);
    } catch (error) {
      console.error("Error fetching WODs:", error);
      setWods([]);
    } finally {
      setWodsLoading(false);
    }
  }, []);

  const loadStrength = useCallback(async () => {
    try {
      const data = await getPersonalRecords();
      setExercises(
        data.filter((exercise) => STRENGTH_CATEGORIES.has(exercise.category)),
      );
    } catch (error) {
      console.error("Error fetching strength exercises:", error);
      setExercises([]);
    } finally {
      setStrengthLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setWodsLoading(true);
      setStrengthLoading(true);
      void loadWods();
      void loadStrength();
    }, [loadWods, loadStrength]),
  );

  const filteredWods = useMemo(() => {
    let result = wods;

    if (activeFilters.length > 0) {
      result = result.filter((wod) =>
        activeFilters.some((filter) => wodMatchesFilter(wod, filter)),
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (wod) =>
          wod.title.toLowerCase().includes(query) ||
          wod.type.toLowerCase().includes(query) ||
          wod.category.toLowerCase().includes(query) ||
          wod.description.toLowerCase().includes(query),
      );
    }

    return result;
  }, [wods, searchQuery, activeFilters]);

  const filteredStrength = useMemo(() => {
    const query = strengthSearch.trim().toLowerCase();
    if (!query) return exercises;
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
    );
  }, [exercises, strengthSearch]);

  const toggleFilter = (filter: WodFilter) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((f) => f !== filter)
        : [...current, filter],
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const resetCreateForm = () => {
    setNewTitle("");
    setNewType("For Time");
    setNewDescription("");
  };

  const handleCreateWod = async () => {
    const title = newTitle.trim();
    const description = newDescription.trim();

    if (!title || !description) {
      alert("Please enter a name and description.");
      return;
    }

    setCreating(true);
    try {
      const created = await createWod({
        title,
        type: newType,
        description,
      });
      setWods((current) => [created, ...current]);
      setShowCreateModal(false);
      resetCreateForm();
      router.push(`/workouts/${created.id}` as Href);
    } catch (error) {
      console.error("Error creating WOD:", error);
      alert(error instanceof Error ? error.message : "Could not create WOD");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateStrength = async () => {
    const name = newExerciseName.trim();
    if (!name) {
      alert("Please enter an exercise name.");
      return;
    }

    setCreatingStrength(true);
    try {
      const created = await createExercise({
        name,
        category: "Weightlifting",
      });
      setExercises((prev) => [...prev, created]);
      setShowCreateStrength(false);
      setNewExerciseName("");
      router.push(
        `/personal-records/${created.id}?from=workouts` as Href,
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Could not create exercise",
      );
    } finally {
      setCreatingStrength(false);
    }
  };

  const filtersActive = activeFilters.length > 0;

  return (
    <ThemedView style={styles.page}>
      <KeyboardScreen contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsUnitPicker}>
          <Pressable
            style={[
              styles.settingsUnitOption,
              activeTab === "wods" && styles.settingsUnitOptionSelected,
            ]}
            onPress={() => setActiveTab("wods")}
          >
            <ThemedText style={styles.settingsUnitOptionLabel}>WODs</ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.settingsUnitOption,
              activeTab === "strength" && styles.settingsUnitOptionSelected,
            ]}
            onPress={() => setActiveTab("strength")}
          >
            <ThemedText style={styles.settingsUnitOptionLabel}>
              Strength
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === "wods" ? (
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <MaterialIcons
                  name="search"
                  size={Layout.iconSm}
                  color={colors.icon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search WODs by name, type, or keyword..."
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

              <Pressable
                style={[
                  styles.filterButton,
                  filtersActive
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setShowFilterModal(true)}
                accessibilityLabel="Filter WODs"
              >
                <MaterialIcons
                  name="filter-list"
                  size={Layout.iconSm}
                  color={filtersActive ? colors.onAccent : colors.icon}
                />
                {filtersActive && (
                  <View style={styles.filterBadge}>
                    <ThemedText
                      lightColor={colors.onAccent}
                      darkColor={colors.onAccent}
                      style={styles.filterBadgeText}
                    >
                      {activeFilters.length}
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </View>

            {filtersActive && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.activeFiltersRow}
              >
                {activeFilters.map((filter) => (
                  <Pressable
                    key={filter}
                    style={styles.activeFilterChip}
                    onPress={() => toggleFilter(filter)}
                  >
                    <ThemedText
                      lightColor={colors.onAccent}
                      darkColor={colors.onAccent}
                      style={styles.activeFilterChipText}
                    >
                      {filter}
                    </ThemedText>
                    <MaterialIcons
                      name="close"
                      size={14}
                      color={colors.onAccent}
                    />
                  </Pressable>
                ))}
                <Pressable onPress={clearFilters} hitSlop={8}>
                  <ThemedText style={styles.textAccent}>Clear all</ThemedText>
                </Pressable>
              </ScrollView>
            )}

            <Pressable
              style={styles.buttonOutline}
              onPress={() => setShowCreateModal(true)}
            >
              <MaterialIcons
                name="add"
                size={Layout.iconSm}
                color={colors.accent}
              />
              <ThemedText style={styles.buttonOutlineText}>
                Create Your Own WOD
              </ThemedText>
            </Pressable>

            <ThemedText type="defaultSemiBold" style={styles.listLabel}>
              {wodsLoading
                ? "Loading…"
                : `${filteredWods.length} WOD${filteredWods.length === 1 ? "" : "s"}`}
            </ThemedText>

            {!wodsLoading && filteredWods.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>
                  No WODs match your search or filters. Try adjusting them.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.listGapSm}>
                {filteredWods.map((wod) => (
                  <Pressable
                    key={wod.id}
                    style={styles.card}
                    onPress={() =>
                      router.push(`/workouts/${wod.id}` as Href)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${wod.title}`}
                  >
                    <View style={styles.rowBetweenStart}>
                      <View style={styles.wodTitleRow}>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.wodTitle}
                        >
                          {wod.title}
                        </ThemedText>
                        {wod.favorited && (
                          <MaterialIcons
                            name="star"
                            size={18}
                            color={colors.favorite}
                          />
                        )}
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={Layout.iconMd}
                        color={colors.icon}
                      />
                    </View>

                    <View style={styles.badgeRow}>
                      <View style={styles.typeBadge}>
                        <ThemedText
                          lightColor={colors.onAccent}
                          darkColor={colors.onAccent}
                          style={styles.typeBadgeText}
                        >
                          {wod.type}
                        </ThemedText>
                      </View>
                      <View style={styles.categoryBadge}>
                        <ThemedText style={styles.categoryBadgeText}>
                          {wod.category}
                        </ThemedText>
                      </View>
                    </View>

                    <ThemedText style={styles.description} numberOfLines={3}>
                      {wod.description}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <ThemedText style={styles.listLabel}>
              Individual lifts and accessories — tap to view or log a PR.
            </ThemedText>

            <View style={styles.searchBar}>
              <MaterialIcons
                name="search"
                size={Layout.iconSm}
                color={colors.icon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search strength movements..."
                placeholderTextColor={colors.icon}
                value={strengthSearch}
                onChangeText={setStrengthSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {strengthSearch.length > 0 && (
                <Pressable onPress={() => setStrengthSearch("")} hitSlop={8}>
                  <MaterialIcons name="close" size={20} color={colors.icon} />
                </Pressable>
              )}
            </View>

            <Pressable
              style={styles.buttonOutline}
              onPress={() => setShowCreateStrength(true)}
            >
              <MaterialIcons
                name="add"
                size={Layout.iconSm}
                color={colors.accent}
              />
              <ThemedText style={styles.buttonOutlineText}>
                Add Strength Movement
              </ThemedText>
            </Pressable>

            <ThemedText type="defaultSemiBold" style={styles.listLabel}>
              {strengthLoading
                ? "Loading…"
                : `${filteredStrength.length} movement${filteredStrength.length === 1 ? "" : "s"}`}
            </ThemedText>

            {!strengthLoading && filteredStrength.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>
                  No strength movements yet. Tap Add Strength Movement to create
                  one.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.listGapSm}>
                {filteredStrength.map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    style={styles.listCard}
                    onPress={() =>
                      router.push(
                        `/personal-records/${exercise.id}?from=workouts` as Href,
                      )
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
                ))}
              </View>
            )}
          </>
        )}
      </KeyboardScreen>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <ModalKeyboardFrame
          onClose={() => setShowFilterModal(false)}
          sheetStyle={styles.sheetFilter}
        >
            <View style={styles.sheetHeader}>
              <ThemedText type="subtitle">Filter WODs</ThemedText>
              {filtersActive && (
                <Pressable onPress={clearFilters} hitSlop={8}>
                  <ThemedText style={styles.textAccent}>Clear all</ThemedText>
                </Pressable>
              )}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {FILTER_SECTIONS.map((section) => (
                <View key={section.title} style={styles.sheetSection}>
                  <ThemedText style={styles.sheetSectionTitle}>
                    {section.title}
                  </ThemedText>
                  <View style={styles.filterChipGrid}>
                    {section.filters.map((filter) => {
                      const selected = activeFilters.includes(filter);
                      return (
                        <Pressable
                          key={filter}
                          style={[
                            styles.chip,
                            selected
                              ? styles.chipSelected
                              : styles.chipUnselected,
                          ]}
                          onPress={() => toggleFilter(filter)}
                        >
                          <ThemedText
                            lightColor={
                              selected ? colors.onAccent : colors.text
                            }
                            darkColor={selected ? colors.onAccent : colors.text}
                            style={styles.chipText}
                          >
                            {filter}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={styles.buttonPrimary}
              onPress={() => setShowFilterModal(false)}
            >
              <ThemedText
                lightColor={colors.onAccent}
                darkColor={colors.onAccent}
                style={styles.buttonPrimaryText}
              >
                Apply Filters
              </ThemedText>
            </Pressable>
        </ModalKeyboardFrame>
      </Modal>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          resetCreateForm();
        }}
      >
        <ModalKeyboardFrame
          onClose={() => {
            setShowCreateModal(false);
            resetCreateForm();
          }}
          sheetStyle={styles.sheetTall}
        >
            <ModalFormScroll>
              <ThemedText type="subtitle" style={styles.sheetTitle}>
                Create WOD
              </ThemedText>

              <ThemedText style={styles.fieldLabel}>Name</ThemedText>
              <BottomSheetInput
                style={styles.input}
                placeholder="e.g. Saturday Chipper"
                placeholderTextColor={colors.icon}
                value={newTitle}
                onChangeText={setNewTitle}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <ThemedText style={styles.fieldLabel}>Type</ThemedText>
              <View style={styles.chipPicker}>
                {WOD_TYPES.map((type) => {
                  const selected = newType === type;
                  return (
                    <Pressable
                      key={type}
                      style={[
                        styles.chip,
                        selected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                      onPress={() => setNewType(type)}
                    >
                      <ThemedText
                        lightColor={selected ? colors.onAccent : colors.text}
                        darkColor={selected ? colors.onAccent : colors.text}
                        style={styles.chipText}
                      >
                        {type}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <ThemedText style={styles.fieldLabel}>Description</ThemedText>
              <BottomSheetInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the workout clearly — movements, reps, weights, time cap..."
                placeholderTextColor={colors.icon}
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <Pressable
                style={[styles.buttonPrimary, creating && { opacity: 0.7 }]}
                onPress={handleCreateWod}
                disabled={creating}
              >
                <ThemedText
                  lightColor={colors.onAccent}
                  darkColor={colors.onAccent}
                  style={styles.buttonPrimaryText}
                >
                  {creating ? "Saving…" : "Save WOD"}
                </ThemedText>
              </Pressable>

              <Pressable
                style={styles.buttonCancel}
                onPress={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
              >
                <ThemedText style={styles.textMuted}>Cancel</ThemedText>
              </Pressable>
            </ModalFormScroll>
        </ModalKeyboardFrame>
      </Modal>

      <Modal
        visible={showCreateStrength}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateStrength(false)}
      >
        <KeyboardSheet onDismiss={() => setShowCreateStrength(false)}>
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Add Strength Movement
          </ThemedText>
          <ThemedText style={styles.fieldLabel}>Exercise name</ThemedText>
          <BottomSheetInput
            style={styles.input}
            placeholder="e.g. Dumbbell Curl"
            placeholderTextColor={colors.icon}
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            autoFocus
            editable={!creatingStrength}
            returnKeyType="done"
            onSubmitEditing={handleCreateStrength}
          />
          <Pressable
            style={[
              styles.buttonPrimary,
              creatingStrength && { opacity: 0.7 },
            ]}
            onPress={handleCreateStrength}
            disabled={creatingStrength}
          >
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              {creatingStrength ? "Saving…" : "Save"}
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.buttonCancel}
            onPress={() => setShowCreateStrength(false)}
          >
            <ThemedText style={styles.textMuted}>Cancel</ThemedText>
          </Pressable>
        </KeyboardSheet>
      </Modal>
    </ThemedView>
  );
}
