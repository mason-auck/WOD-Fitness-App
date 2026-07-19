import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
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

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { Wod } from "@/constants/wods";
import { Layout } from "@/constants/theme";
import {
  favoriteWod,
  getWodById,
  unfavoriteWod,
} from "@/lib/api/wods-api";
import { useAppStyles } from "@/hooks/use-app-styles";

type WodOption = "timer" | "log" | "history" | "favorite";

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

  const handleWodOption = async (option: WodOption) => {
    if (!wod) return;
    setShowOptions(false);

    switch (option) {
      case "timer":
        alert(`Start timer for ${wod.title} — coming soon`);
        break;
      case "log":
        alert(`Log score for ${wod.title} — coming soon`);
        break;
      case "history":
        alert(`View history for ${wod.title} — coming soon`);
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
            onPress={() => router.replace("/WODs" as Href)}
          >
            <ThemedText style={styles.buttonOutlineText}>Back to WODs</ThemedText>
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
