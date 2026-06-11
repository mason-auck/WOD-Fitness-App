import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState, type ComponentProps } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Layout } from "@/constants/theme";
import { useAppStyles } from "@/hooks/use-app-styles";

export type WodType =
  | "For Time"
  | "Weight"
  | "Reps & Time"
  | "AMRAP"
  | "Custom";

export type WodCategory =
  | "RSS WODs"
  | "Open WODs"
  | "The Girls"
  | "Heroes"
  | "Benchmarks"
  | "Bodyweight"
  | "Custom";

type Wod = {
  id: string;
  title: string;
  type: WodType;
  category: WodCategory;
  description: string;
  favorited: boolean;
  isUserCreated?: boolean;
};

type WodFilter = "Favorites" | WodType | WodCategory;

const WOD_TYPES: WodType[] = [
  "For Time",
  "Weight",
  "Reps & Time",
  "AMRAP",
  "Custom",
];

const WOD_CATEGORIES: WodCategory[] = [
  "RSS WODs",
  "Open WODs",
  "The Girls",
  "Heroes",
  "Benchmarks",
  "Bodyweight",
  "Custom",
];

const SCORING_TYPE_FILTERS: WodType[] = WOD_TYPES;

const FILTER_SECTIONS: { title: string; filters: WodFilter[] }[] = [
  { title: "Other", filters: ["Favorites"] },
  { title: "Scoring Type", filters: SCORING_TYPE_FILTERS },
  { title: "Category", filters: WOD_CATEGORIES },
];

const INITIAL_WODS: Wod[] = [
  {
    id: "1",
    title: "Fran",
    type: "For Time",
    category: "The Girls",
    description:
      "21-15-9 reps for time of thrusters (95/65 lb) and pull-ups. Post total time to complete all reps.",
    favorited: true,
  },
  {
    id: "2",
    title: "1RM Back Squat",
    type: "Weight",
    category: "Benchmarks",
    description:
      "Work up to a 1-rep max back squat. Warm up thoroughly, then add weight each attempt until you hit your max.",
    favorited: false,
  },
  {
    id: "3",
    title: "Karen",
    type: "Reps & Time",
    category: "The Girls",
    description:
      "150 wall-ball shots (20/14 lb) for time. Post total reps completed and time if capped.",
    favorited: false,
  },
  {
    id: "4",
    title: "Cindy",
    type: "AMRAP",
    category: "The Girls",
    description:
      "20-minute AMRAP of 5 pull-ups, 10 push-ups, and 15 air squats. Score is total rounds plus reps.",
    favorited: true,
  },
  {
    id: "5",
    title: "Murph",
    type: "For Time",
    category: "Heroes",
    description:
      "1 mile run, 100 pull-ups, 200 push-ups, 300 air squats, 1 mile run. Partition reps as needed.",
    favorited: false,
  },
  {
    id: "6",
    title: "Annie",
    type: "For Time",
    category: "The Girls",
    description:
      "50-40-30-20-10 reps for time of double-unders and sit-ups.",
    favorited: false,
  },
  {
    id: "7",
    title: "Today's RSS WOD",
    type: "AMRAP",
    category: "RSS WODs",
    description:
      "Synced from RSS feed: 12-minute AMRAP of 10 toes-to-bar and 10 dumbbell snatches (50/35 lb).",
    favorited: false,
  },
  {
    id: "8",
    title: "26.1",
    type: "For Time",
    category: "Open WODs",
    description:
      "CrossFit Open workout from the current season. Check the Open page for official standards and scoring.",
    favorited: false,
  },
  {
    id: "9",
    title: "100 Burpees for Time",
    type: "For Time",
    category: "Bodyweight",
    description:
      "100 burpees for time. No equipment required — post your total time to complete all reps.",
    favorited: false,
  },
  {
    id: "10",
    title: "Partner Chipper",
    type: "Custom",
    category: "Custom",
    description:
      "With a partner, alternate movements: 50 cal row, 40 box jumps, 30 KB swings, 20 burpees, 10 cleans. Split work any way.",
    favorited: false,
    isUserCreated: true,
  },
];

type WodOption = "timer" | "log" | "history" | "favorite";

function wodMatchesFilter(wod: Wod, filter: WodFilter): boolean {
  if (filter === "Favorites") return wod.favorited;
  if (WOD_TYPES.includes(filter as WodType)) return wod.type === filter;
  return wod.category === filter;
}

export default function WODsScreen() {
  const { colors, styles } = useAppStyles();

  const [wods, setWods] = useState<Wod[]>(INITIAL_WODS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<WodFilter[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [optionsWod, setOptionsWod] = useState<Wod | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<WodType>("For Time");
  const [newDescription, setNewDescription] = useState("");

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

  const toggleFilter = (filter: WodFilter) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((f) => f !== filter)
        : [...current, filter],
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const handleWodOption = (option: WodOption) => {
    if (!optionsWod) return;

    switch (option) {
      case "timer":
        alert(`Start timer for ${optionsWod.title} — coming soon`);
        break;
      case "log":
        alert(`Log score for ${optionsWod.title} — coming soon`);
        break;
      case "history":
        alert(`View history for ${optionsWod.title} — coming soon`);
        break;
      case "favorite":
        setWods((current) =>
          current.map((wod) =>
            wod.id === optionsWod.id
              ? { ...wod, favorited: !wod.favorited }
              : wod,
          ),
        );
        break;
    }

    setOptionsWod(null);
  };

  const resetCreateForm = () => {
    setNewTitle("");
    setNewType("For Time");
    setNewDescription("");
  };

  const handleCreateWod = () => {
    const title = newTitle.trim();
    const description = newDescription.trim();

    if (!title || !description) {
      alert("Please enter a name and description.");
      return;
    }

    setWods((current) => [
      {
        id: Date.now().toString(),
        title,
        type: newType,
        category: "Custom",
        description,
        favorited: false,
        isUserCreated: true,
      },
      ...current,
    ]);

    setShowCreateModal(false);
    resetCreateForm();
  };

  const filtersActive = activeFilters.length > 0;

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="subtitle">Workouts</ThemedText>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={Layout.iconSm} color={colors.icon} />
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
                <MaterialIcons name="close" size={14} color={colors.onAccent} />
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
          <MaterialIcons name="add" size={Layout.iconSm} color={colors.accent} />
          <ThemedText style={styles.buttonOutlineText}>
            Create Your Own WOD
          </ThemedText>
        </Pressable>

        <ThemedText type="defaultSemiBold" style={styles.listLabel}>
          {filteredWods.length} WOD{filteredWods.length === 1 ? "" : "s"}
        </ThemedText>

        {filteredWods.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No WODs match your search or filters. Try adjusting them.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listGapSm}>
            {filteredWods.map((wod) => (
              <View key={wod.id} style={styles.card}>
                <View style={styles.rowBetweenStart}>
                  <View style={styles.wodTitleRow}>
                    <ThemedText type="defaultSemiBold" style={styles.wodTitle}>
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
                  <Pressable
                    onPress={() => setOptionsWod(wod)}
                    hitSlop={8}
                    accessibilityLabel={`Options for ${wod.title}`}
                  >
                    <MaterialIcons
                      name="more-vert"
                      size={Layout.iconMd}
                      color={colors.icon}
                    />
                  </Pressable>
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

                <ThemedText style={styles.description}>
                  {wod.description}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetFilter]}>
            <View style={styles.sheetHeader}>
              <ThemedText type="subtitle">Filter WODs</ThemedText>
              {filtersActive && (
                <Pressable onPress={clearFilters} hitSlop={8}>
                  <ThemedText style={styles.textAccent}>Clear all</ThemedText>
                </Pressable>
              )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
                            darkColor={
                              selected ? colors.onAccent : colors.text
                            }
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
          </View>
        </View>
      </Modal>

      <Modal
        visible={optionsWod !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsWod(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOptionsWod(null)}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <ThemedText type="defaultSemiBold" style={styles.sheetTitle}>
              {optionsWod?.title}
            </ThemedText>

            <OptionRow
              icon="timer"
              label="Start Timer"
              onPress={() => handleWodOption("timer")}
            />
            <OptionRow
              icon="edit-note"
              label="Log Score"
              onPress={() => handleWodOption("log")}
            />
            <OptionRow
              icon="history"
              label="View History"
              onPress={() => handleWodOption("history")}
            />
            <OptionRow
              icon={optionsWod?.favorited ? "star" : "star-outline"}
              label={
                optionsWod?.favorited ? "Remove from Favorites" : "Favorite WOD"
              }
              onPress={() => handleWodOption("favorite")}
            />

            <Pressable
              style={styles.buttonCancel}
              onPress={() => setOptionsWod(null)}
            >
              <ThemedText style={styles.textMuted}>Cancel</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
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
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetTall]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ThemedText type="subtitle" style={styles.sheetTitle}>
                Create WOD
              </ThemedText>

              <ThemedText style={styles.fieldLabel}>Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. Saturday Chipper"
                placeholderTextColor={colors.icon}
                value={newTitle}
                onChangeText={setNewTitle}
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
                        selected
                          ? styles.chipSelected
                          : styles.chipUnselected,
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
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the workout clearly — movements, reps, weights, time cap..."
                placeholderTextColor={colors.icon}
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <Pressable style={styles.buttonPrimary} onPress={handleCreateWod}>
                <ThemedText
                  lightColor={colors.onAccent}
                  darkColor={colors.onAccent}
                  style={styles.buttonPrimaryText}
                >
                  Save WOD
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

function OptionRow({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors, styles } = useAppStyles();

  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <MaterialIcons name={icon} size={Layout.iconSm} color={colors.accent} />
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}
