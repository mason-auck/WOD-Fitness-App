import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  formatSelectedDate,
  getCalendarCells,
  MONTH_NAMES,
  toDateKey,
  toDateKeyFromDate,
  WEEKDAY_LABELS,
  type CalendarLog,
} from "@/constants/calendar";
import { Layout } from "@/constants/theme";
import type { Wod } from "@/constants/wods";
import { useAppStyles } from "@/hooks/use-app-styles";
import {
  createActivityLog,
  getActivityLogs,
  toCalendarLog,
} from "@/lib/api/activity-api";
import {
  getPersonalRecords,
  type ExerciseDto,
} from "@/lib/api/exercise-api";
import { getWods } from "@/lib/api/wods-api";

type AddModal =
  | "menu"
  | "wod-pick"
  | "wod-score"
  | "pr-pick"
  | "pr-value"
  | null;

const TODAY = new Date();

export default function CalendarScreen() {
  const { colors, styles } = useAppStyles();

  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(
    toDateKeyFromDate(TODAY),
  );
  const [logs, setLogs] = useState<CalendarLog[]>([]);
  const [wods, setWods] = useState<Wod[]>([]);
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addModal, setAddModal] = useState<AddModal>(null);
  const [selectedWod, setSelectedWod] = useState<Wod | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(
    null,
  );
  const [wodSearch, setWodSearch] = useState("");
  const [prSearch, setPrSearch] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [activity, wodList, exerciseList] = await Promise.all([
        getActivityLogs(),
        getWods(),
        getPersonalRecords(),
      ]);
      setLogs(activity.map(toCalendarLog));
      setWods(wodList);
      setExercises(exerciseList);
    } catch (error) {
      console.error("Error loading calendar:", error);
      alert(
        error instanceof Error ? error.message : "Could not load calendar",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadData();
    }, [loadData]),
  );

  const todayKey = toDateKeyFromDate(TODAY);
  const calendarCells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const datesWithLogs = useMemo(() => {
    const set = new Set<string>();
    for (const log of logs) {
      set.add(log.dateKey);
    }
    return set;
  }, [logs]);

  const selectedDayLogs = useMemo(
    () => logs.filter((log) => log.dateKey === selectedDateKey),
    [logs, selectedDateKey],
  );

  const filteredWods = useMemo(() => {
    const query = wodSearch.trim().toLowerCase();
    if (!query) return wods;
    return wods.filter(
      (wod) =>
        wod.title.toLowerCase().includes(query) ||
        wod.type.toLowerCase().includes(query) ||
        wod.category.toLowerCase().includes(query),
    );
  }, [wodSearch, wods]);

  const filteredExercises = useMemo(() => {
    const query = prSearch.trim().toLowerCase();
    if (!query) return exercises;
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
    );
  }, [prSearch, exercises]);

  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  const closeAddModal = () => {
    setAddModal(null);
    setSelectedWod(null);
    setSelectedExercise(null);
    setWodSearch("");
    setPrSearch("");
    setScoreInput("");
    setNotesInput("");
  };

  const saveWodLog = async () => {
    const score = scoreInput.trim();
    if (!selectedWod || !score) {
      alert("Please enter a score.");
      return;
    }

    setSaving(true);
    try {
      const notes = notesInput.trim();
      const created = await createActivityLog({
        kind: "wod",
        loggedOn: selectedDateKey,
        wodId: selectedWod.id,
        result: score,
        ...(notes ? { notes } : {}),
      });
      setLogs((current) => [toCalendarLog(created), ...current]);
      closeAddModal();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Could not save WOD log");
    } finally {
      setSaving(false);
    }
  };

  const savePrLog = async () => {
    const value = scoreInput.trim();
    if (!selectedExercise || !value) {
      alert("Please enter a value.");
      return;
    }

    setSaving(true);
    try {
      const notes = notesInput.trim();
      const created = await createActivityLog({
        kind: "pr",
        loggedOn: selectedDateKey,
        exerciseId: selectedExercise.id,
        result: value,
        ...(notes ? { notes } : {}),
      });
      setLogs((current) => [toCalendarLog(created), ...current]);
      closeAddModal();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Could not save PR log");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.page, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="subtitle">Calendar</ThemedText>

        <View style={styles.calendarMonthHeader}>
          <Pressable onPress={goToPreviousMonth} hitSlop={12}>
            <MaterialIcons name="chevron-left" size={28} color={colors.icon} />
          </Pressable>
          <ThemedText type="defaultSemiBold">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </ThemedText>
          <Pressable onPress={goToNextMonth} hitSlop={12}>
            <MaterialIcons name="chevron-right" size={28} color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.calendarWeekRow}>
          {WEEKDAY_LABELS.map((label) => (
            <ThemedText key={label} style={styles.calendarWeekday}>
              {label}
            </ThemedText>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarCells.map((day, index) => {
            if (day === null) {
              return (
                <View key={`empty-${index}`} style={styles.calendarDayCell} />
              );
            }

            const dateKey = toDateKey(viewYear, viewMonth, day);
            const isSelected = dateKey === selectedDateKey;
            const isToday = dateKey === todayKey;
            const hasLogs = datesWithLogs.has(dateKey);

            return (
              <Pressable
                key={dateKey}
                style={[
                  styles.calendarDayCell,
                  isSelected && styles.calendarDaySelected,
                  isToday && !isSelected && styles.calendarDayToday,
                ]}
                onPress={() => setSelectedDateKey(dateKey)}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    { color: isSelected ? colors.onAccent : colors.text },
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {day}
                </Text>
                {hasLogs && (
                  <View
                    style={[
                      styles.calendarDayDot,
                      isSelected && styles.calendarDayDotSelected,
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="defaultSemiBold" style={styles.calendarLogsHeader}>
          {formatSelectedDate(selectedDateKey)}
        </ThemedText>
        <ThemedText style={styles.listLabel}>
          {selectedDayLogs.length} log{selectedDayLogs.length === 1 ? "" : "s"}
        </ThemedText>

        {selectedDayLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No workouts logged for this day. Tap + to add one.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listGapSm}>
            {selectedDayLogs.map((log) => (
              <View key={log.id} style={styles.calendarLogCard}>
                <View style={styles.calendarLogHeader}>
                  <View style={styles.calendarLogInfo}>
                    <ThemedText type="defaultSemiBold">
                      {log.kind === "wod" ? log.title : log.movement}
                    </ThemedText>
                    {log.kind === "wod" && (
                      <ThemedText style={styles.activityDate}>
                        {log.wodType}
                      </ThemedText>
                    )}
                    {log.kind === "pr" && (
                      <ThemedText style={styles.activityDate}>
                        Personal Record
                      </ThemedText>
                    )}
                  </View>
                  <View
                    style={[
                      styles.calendarLogBadge,
                      log.kind === "wod" && styles.calendarLogBadgeWod,
                    ]}
                  >
                    <ThemedText
                      lightColor={
                        log.kind === "wod" ? colors.onAccent : undefined
                      }
                      darkColor={
                        log.kind === "wod" ? colors.onAccent : undefined
                      }
                      style={styles.calendarLogBadgeText}
                    >
                      {log.kind === "wod" ? "WOD" : "PR"}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.calendarLogScore}>
                  {log.kind === "wod" ? log.score : log.value}
                </ThemedText>
                {log.notes ? (
                  <ThemedText style={styles.feedNotes}>{log.notes}</ThemedText>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        style={styles.calendarFab}
        onPress={() => setAddModal("menu")}
        accessibilityLabel="Add log"
      >
        <MaterialIcons name="add" size={28} color={colors.onAccent} />
      </Pressable>

      <Modal
        visible={addModal !== null}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetTall]}>
            {addModal === "menu" && (
              <>
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Log for {formatSelectedDate(selectedDateKey)}
                </ThemedText>
                <Pressable
                  style={styles.optionRow}
                  onPress={() => setAddModal("wod-pick")}
                >
                  <MaterialIcons
                    name="fitness-center"
                    size={Layout.iconSm}
                    color={colors.accent}
                  />
                  <ThemedText type="defaultSemiBold">Log WOD</ThemedText>
                </Pressable>
                <Pressable
                  style={styles.optionRow}
                  onPress={() => setAddModal("pr-pick")}
                >
                  <MaterialIcons
                    name="emoji-events"
                    size={Layout.iconSm}
                    color={colors.accent}
                  />
                  <ThemedText type="defaultSemiBold">
                    Log Personal Record
                  </ThemedText>
                </Pressable>
                <Pressable style={styles.buttonCancel} onPress={closeAddModal}>
                  <ThemedText style={styles.textMuted}>Cancel</ThemedText>
                </Pressable>
              </>
            )}

            {addModal === "wod-pick" && (
              <>
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Select WOD
                </ThemedText>
                <View style={styles.searchBar}>
                  <MaterialIcons
                    name="search"
                    size={Layout.iconSm}
                    color={colors.icon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search WODs..."
                    placeholderTextColor={colors.icon}
                    value={wodSearch}
                    onChangeText={setWodSearch}
                    autoCapitalize="none"
                  />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredWods.map((wod) => (
                    <Pressable
                      key={wod.id}
                      style={styles.calendarPickerItem}
                      onPress={() => {
                        setSelectedWod(wod);
                        setAddModal("wod-score");
                      }}
                    >
                      <ThemedText type="defaultSemiBold">{wod.title}</ThemedText>
                      <ThemedText style={styles.activityDate}>
                        {wod.type} · {wod.category}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={styles.buttonCancel}
                  onPress={() => setAddModal("menu")}
                >
                  <ThemedText style={styles.textMuted}>Back</ThemedText>
                </Pressable>
              </>
            )}

            {addModal === "wod-score" && selectedWod && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Log {selectedWod.title}
                </ThemedText>
                <ThemedText style={styles.listLabel}>
                  {formatSelectedDate(selectedDateKey)} · {selectedWod.type}
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>Score</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 4:32, 225 lbs, 15 rounds + 3"
                  placeholderTextColor={colors.icon}
                  value={scoreInput}
                  onChangeText={setScoreInput}
                  editable={!saving}
                />

                <ThemedText style={styles.fieldLabel}>Notes (optional)</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="How it felt, scaling, etc."
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
                  onPress={saveWodLog}
                  disabled={saving}
                >
                  <ThemedText
                    lightColor={colors.onAccent}
                    darkColor={colors.onAccent}
                    style={styles.buttonPrimaryText}
                  >
                    {saving ? "Saving…" : "Save WOD Log"}
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.buttonCancel}
                  onPress={() => setAddModal("wod-pick")}
                >
                  <ThemedText style={styles.textMuted}>Back</ThemedText>
                </Pressable>
              </ScrollView>
            )}

            {addModal === "pr-pick" && (
              <>
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Select Personal Record
                </ThemedText>
                <View style={styles.searchBar}>
                  <MaterialIcons
                    name="search"
                    size={Layout.iconSm}
                    color={colors.icon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search movements..."
                    placeholderTextColor={colors.icon}
                    value={prSearch}
                    onChangeText={setPrSearch}
                    autoCapitalize="none"
                  />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredExercises.map((exercise) => (
                    <Pressable
                      key={exercise.id}
                      style={styles.calendarPickerItem}
                      onPress={() => {
                        setSelectedExercise(exercise);
                        setScoreInput(exercise.currentPr ?? "");
                        setAddModal("pr-value");
                      }}
                    >
                      <ThemedText type="defaultSemiBold">
                        {exercise.name}
                      </ThemedText>
                      <ThemedText style={styles.activityDate}>
                        {exercise.category} · Current PR:{" "}
                        {exercise.currentPr ?? "—"}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={styles.buttonCancel}
                  onPress={() => setAddModal("menu")}
                >
                  <ThemedText style={styles.textMuted}>Back</ThemedText>
                </Pressable>
              </>
            )}

            {addModal === "pr-value" && selectedExercise && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Log {selectedExercise.name}
                </ThemedText>
                <ThemedText style={styles.listLabel}>
                  {formatSelectedDate(selectedDateKey)} ·{" "}
                  {selectedExercise.category}
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>Value</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 230 lbs, 5 reps"
                  placeholderTextColor={colors.icon}
                  value={scoreInput}
                  onChangeText={setScoreInput}
                  editable={!saving}
                />

                <ThemedText style={styles.fieldLabel}>Notes (optional)</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Context for this PR attempt..."
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
                  onPress={savePrLog}
                  disabled={saving}
                >
                  <ThemedText
                    lightColor={colors.onAccent}
                    darkColor={colors.onAccent}
                    style={styles.buttonPrimaryText}
                  >
                    {saving ? "Saving…" : "Save PR Log"}
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.buttonCancel}
                  onPress={() => setAddModal("pr-pick")}
                >
                  <ThemedText style={styles.textMuted}>Back</ThemedText>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
