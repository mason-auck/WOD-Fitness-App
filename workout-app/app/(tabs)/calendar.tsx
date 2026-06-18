import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import {
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
  INITIAL_CALENDAR_LOGS,
  MONTH_NAMES,
  toDateKey,
  toDateKeyFromDate,
  WEEKDAY_LABELS,
  type CalendarLog,
} from "@/constants/calendar";
import type { PersonalRecord } from "@/constants/personal-records";
import { Layout } from "@/constants/theme";
import { INITIAL_WODS, type Wod } from "@/constants/wods";
import { useExercises } from "@/contexts/exercises-context";
import { useProgress } from "@/contexts/progress-context";
import { useAppStyles } from "@/hooks/use-app-styles";

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
  const { personalRecords, logPr: logExercisePr } = useExercises();
  const { awardWodXp, awardPrXp } = useProgress();

  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKeyFromDate(TODAY));
  const [logs, setLogs] = useState<CalendarLog[]>(INITIAL_CALENDAR_LOGS);

  const [addModal, setAddModal] = useState<AddModal>(null);
  const [selectedWod, setSelectedWod] = useState<Wod | null>(null);
  const [selectedPr, setSelectedPr] = useState<PersonalRecord | null>(null);
  const [wodSearch, setWodSearch] = useState("");
  const [prSearch, setPrSearch] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

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
    if (!query) return INITIAL_WODS;
    return INITIAL_WODS.filter(
      (wod) =>
        wod.title.toLowerCase().includes(query) ||
        wod.type.toLowerCase().includes(query) ||
        wod.category.toLowerCase().includes(query),
    );
  }, [wodSearch]);

  const filteredPrs = useMemo(() => {
    const query = prSearch.trim().toLowerCase();
    if (!query) return personalRecords;
    return personalRecords.filter(
      (pr) =>
        pr.movement.toLowerCase().includes(query) ||
        pr.category.toLowerCase().includes(query),
    );
  }, [prSearch, personalRecords]);

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
    setSelectedPr(null);
    setWodSearch("");
    setPrSearch("");
    setScoreInput("");
    setNotesInput("");
  };

  const saveWodLog = () => {
    const score = scoreInput.trim();
    if (!selectedWod || !score) {
      alert("Please enter a score.");
      return;
    }

    const entry: CalendarLog = {
      id: Date.now().toString(),
      kind: "wod",
      dateKey: selectedDateKey,
      wodId: selectedWod.id,
      title: selectedWod.title,
      wodType: selectedWod.type,
      score,
      notes: notesInput.trim() || undefined,
    };

    setLogs((current) => [entry, ...current]);
    awardWodXp();
    closeAddModal();
  };

  const savePrLog = () => {
    const value = scoreInput.trim();
    if (!selectedPr || !value) {
      alert("Please enter a value.");
      return;
    }

    logExercisePr(selectedPr.id, value, {
      notes: notesInput,
      dateKey: selectedDateKey,
    });

    const entry: CalendarLog = {
      id: Date.now().toString(),
      kind: "pr",
      dateKey: selectedDateKey,
      prId: selectedPr.id,
      movement: selectedPr.movement,
      value,
      notes: notesInput.trim() || undefined,
    };

    setLogs((current) => [entry, ...current]);
    awardPrXp();
    closeAddModal();
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
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
              return <View key={`empty-${index}`} style={styles.calendarDayCell} />;
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
                      lightColor={log.kind === "wod" ? colors.onAccent : undefined}
                      darkColor={log.kind === "wod" ? colors.onAccent : undefined}
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
                  <ThemedText type="defaultSemiBold">Log Personal Record</ThemedText>
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
                />

                <Pressable style={styles.buttonPrimary} onPress={saveWodLog}>
                  <ThemedText
                    lightColor={colors.onAccent}
                    darkColor={colors.onAccent}
                    style={styles.buttonPrimaryText}
                  >
                    Save WOD Log
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
                  {filteredPrs.map((pr) => (
                    <Pressable
                      key={pr.id}
                      style={styles.calendarPickerItem}
                      onPress={() => {
                        setSelectedPr(pr);
                        setScoreInput(pr.currentPr);
                        setAddModal("pr-value");
                      }}
                    >
                      <ThemedText type="defaultSemiBold">{pr.movement}</ThemedText>
                      <ThemedText style={styles.activityDate}>
                        {pr.category} · Current PR: {pr.currentPr}
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

            {addModal === "pr-value" && selectedPr && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <ThemedText type="subtitle" style={styles.sheetTitle}>
                  Log {selectedPr.movement}
                </ThemedText>
                <ThemedText style={styles.listLabel}>
                  {formatSelectedDate(selectedDateKey)} · {selectedPr.category}
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>Value</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 230 lbs, 5 reps"
                  placeholderTextColor={colors.icon}
                  value={scoreInput}
                  onChangeText={setScoreInput}
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
                />

                <Pressable style={styles.buttonPrimary} onPress={savePrLog}>
                  <ThemedText
                    lightColor={colors.onAccent}
                    darkColor={colors.onAccent}
                    style={styles.buttonPrimaryText}
                  >
                    Save PR Log
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
