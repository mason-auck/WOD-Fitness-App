import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, TextInput, View } from "react-native";

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
import { createWod, getWods } from "@/lib/api/wods-api";
import { useAppStyles } from "@/hooks/use-app-styles";

type WodFilter = "Favorites" | WodType | WodCategory;

const SCORING_TYPE_FILTERS: WodType[] = WOD_TYPES;

const FILTER_SECTIONS: { title: string; filters: WodFilter[] }[] = [
  { title: "Other", filters: ["Favorites"] },
  { title: "Scoring Type", filters: SCORING_TYPE_FILTERS },
  { title: "Category", filters: WOD_CATEGORIES },
];

function wodMatchesFilter(wod: Wod, filter: WodFilter): boolean {
  if (filter === "Favorites") return wod.favorited;
  if (WOD_TYPES.includes(filter as WodType)) return wod.type === filter;
  return wod.category === filter;
}

export default function WODsScreen() {
  const { colors, styles } = useAppStyles();
  const router = useRouter();

  const [wods, setWods] = useState<Wod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<WodFilter[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<WodType>("For Time");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const loadWods = useCallback(async () => {
    try {
      const data = await getWods();
      setWods(data as Wod[]);
    } catch (error) {
      console.error("Error fetching WODs:", error);
      setWods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWods();
    }, [loadWods]),
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
      router.push(`/WODs/${created.id}` as Href);
    } catch (error) {
      console.error("Error creating WOD:", error);
      alert(error instanceof Error ? error.message : "Could not create WOD");
    } finally {
      setCreating(false);
    }
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
          {loading
            ? "Loading…"
            : `${filteredWods.length} WOD${filteredWods.length === 1 ? "" : "s"}`}
        </ThemedText>

        {!loading && filteredWods.length === 0 ? (
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
                onPress={() => router.push(`/WODs/${wod.id}` as Href)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${wod.title}`}
              >
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
          </View>
        </View>
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
