import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
  type Href,
} from "expo-router";
import { useCallback, useEffect, useState, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { KeyboardSheet } from "@/components/keyboard-sheet";
import { BottomSheetInput } from "@/components/modal-keyboard-frame";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatSelectedDate, toDateKeyFromDate } from "@/constants/calendar";
import type { Wod } from "@/constants/wods";
import { Layout } from "@/constants/theme";
import {
  createActivityLog,
  type ActivityLogDto,
} from "@/lib/api/activity-api";
import {
  favoriteWod,
  getWodById,
  getWodHistory,
  unfavoriteWod,
} from "@/lib/api/wods-api";
import { useAppStyles } from "@/hooks/use-app-styles";

type WodOption = "timer" | "log" | "history" | "favorite";
type DetailModal = "log" | "history" | null;

export default function WodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, styles } = useAppStyles();

  const [wod, setWod] = useState<Wod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [detailModal, setDetailModal] = useState<DetailModal>(null);
  const [scoreInput, setScoreInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<ActivityLogDto[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadWod = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWodById(id);
      setWod(data);
    } catch (err) {
      console.error("Error fetching WOD:", err);
      setError(err instanceof Error ? err.message : "Could not load WOD");
      setWod(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWod();
  }, [loadWod]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ headerShown: false });
      return () => {
        parent?.setOptions({ headerShown: true });
      };
    }, [navigation]),
  );

  useEffect(() => {
    if (wod) {
      navigation.setOptions({
        title: wod.title,
        headerRight: () => (
          <Pressable
            onPress={() => setShowOptions(true)}
            hitSlop={8}
            accessibilityLabel={`Options for ${wod.title}`}
            style={{ marginRight: 4, padding: 4 }}
          >
            <MaterialIcons
              name="more-vert"
              size={Layout.iconMd}
              color={colors.text}
            />
          </Pressable>
        ),
      });
    }
  }, [wod, navigation, colors.text]);

  const openHistory = async () => {
    if (!wod) return;
    setDetailModal("history");
    setHistoryLoading(true);
    try {
      const entries = await getWodHistory(wod.id);
      setHistory(entries);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not load history");
      setDetailModal(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const saveScore = async () => {
    if (!wod) return;
    const score = scoreInput.trim();
    if (!score) {
      alert("Please enter a score.");
      return;
    }

    setSaving(true);
    try {
      const notes = notesInput.trim();
      await createActivityLog({
        kind: "wod",
        loggedOn: toDateKeyFromDate(new Date()),
        wodId: wod.id,
        result: score,
        ...(notes ? { notes } : {}),
      });
      setDetailModal(null);
      setScoreInput("");
      setNotesInput("");
      alert("Score logged.");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not log score");
    } finally {
      setSaving(false);
    }
  };

  const handleWodOption = async (option: WodOption) => {
    if (!wod) return;
    setShowOptions(false);

    switch (option) {
      case "timer":
        alert(`Start timer for ${wod.title} — coming soon`);
        break;
      case "log":
        setScoreInput("");
        setNotesInput("");
        setDetailModal("log");
        break;
      case "history":
        await openHistory();
        break;
      case "favorite": {
        setFavoriting(true);
        try {
          if (wod.favorited) {
            await unfavoriteWod(wod.id);
            setWod({ ...wod, favorited: false });
          } else {
            await favoriteWod(wod.id);
            setWod({ ...wod, favorited: true });
          }
        } catch (err) {
          console.error("Error updating favorite:", err);
          alert(
            err instanceof Error ? err.message : "Could not update favorite",
          );
        } finally {
          setFavoriting(false);
        }
        break;
      }
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.page, styles.centeredScreen]}>
        <ActivityIndicator color={colors.tint} />
      </ThemedView>
    );
  }

  if (error || !wod) {
    return (
      <ThemedView style={styles.page}>
        <View style={[styles.scrollContent, styles.emptyState]}>
          <ThemedText style={styles.emptyStateText}>
            {error ?? "WOD not found."}
          </ThemedText>
          <Pressable
            style={styles.buttonOutline}
            onPress={() => router.replace("/workouts" as Href)}
          >
            <ThemedText style={styles.buttonOutlineText}>
              Back to Workouts
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rowBetweenStart}>
          <ThemedText type="title" style={[styles.wodTitle, { flex: 1 }]}>
            {wod.title}
          </ThemedText>
          {wod.favorited && (
            <MaterialIcons name="star" size={24} color={colors.favorite} />
          )}
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
          {wod.isUserCreated && (
            <View style={styles.categoryBadge}>
              <ThemedText style={styles.categoryBadgeText}>Custom</ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Description
        </ThemedText>
        <ThemedText style={styles.description}>{wod.description}</ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Actions
        </ThemedText>

        <View style={styles.listGapSm}>
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
            icon={wod.favorited ? "star" : "star-outline"}
            label={
              favoriting
                ? "Updating…"
                : wod.favorited
                  ? "Remove from Favorites"
                  : "Favorite WOD"
            }
            onPress={() => handleWodOption("favorite")}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <ThemedText type="defaultSemiBold" style={styles.sheetTitle}>
              {wod.title}
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
              icon={wod.favorited ? "star" : "star-outline"}
              label={
                wod.favorited ? "Remove from Favorites" : "Favorite WOD"
              }
              onPress={() => handleWodOption("favorite")}
            />

            <Pressable
              style={styles.buttonCancel}
              onPress={() => setShowOptions(false)}
            >
              <ThemedText style={styles.textMuted}>Cancel</ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={detailModal === "log"}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModal(null)}
      >
        <KeyboardSheet onDismiss={() => setDetailModal(null)}>
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Log {wod.title}
          </ThemedText>

          <ThemedText style={styles.fieldLabel}>Score</ThemedText>
          <BottomSheetInput
            style={styles.input}
            placeholder="e.g. 4:32, 225 lbs, 15 rounds + 3"
            placeholderTextColor={colors.icon}
            value={scoreInput}
            onChangeText={setScoreInput}
            editable={!saving}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <ThemedText style={styles.fieldLabel}>Notes (optional)</ThemedText>
          <BottomSheetInput
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
            onPress={saveScore}
            disabled={saving}
          >
            <ThemedText
              lightColor={colors.onAccent}
              darkColor={colors.onAccent}
              style={styles.buttonPrimaryText}
            >
              {saving ? "Saving…" : "Save Score"}
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.buttonCancel}
            onPress={() => setDetailModal(null)}
          >
            <ThemedText style={styles.textMuted}>Cancel</ThemedText>
          </Pressable>
        </KeyboardSheet>
      </Modal>

      <Modal
        visible={detailModal === "history"}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetTall]}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              History — {wod.title}
            </ThemedText>

            {historyLoading ? (
              <ActivityIndicator color={colors.accent} />
            ) : history.length === 0 ? (
              <ThemedText style={styles.emptyStateText}>
                No scores logged yet.
              </ThemedText>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.listGapSm}>
                  {history.map((entry) => (
                    <View key={entry.id} style={styles.calendarLogCard}>
                      <View style={styles.calendarLogHeader}>
                        <ThemedText type="defaultSemiBold">
                          {entry.result}
                        </ThemedText>
                        <ThemedText style={styles.activityDate}>
                          {formatSelectedDate(String(entry.dateKey))}
                        </ThemedText>
                      </View>
                      {entry.notes ? (
                        <ThemedText style={styles.feedNotes}>
                          {entry.notes}
                        </ThemedText>
                      ) : null}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}

            <Pressable
              style={styles.buttonCancel}
              onPress={() => setDetailModal(null)}
            >
              <ThemedText style={styles.textMuted}>Close</ThemedText>
            </Pressable>
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
