import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  XP_PER_PR,
  XP_PER_WOD,
  type SkillLevel,
  type SkillProgress,
} from "@/constants/skill-level";
import { useAppStyles } from "@/hooks/use-app-styles";
import {
  getMeSkill,
  getSkillLevels,
} from "@/lib/api/profile-api";

export default function SkillLevelScreen() {
  const { colors, styles } = useAppStyles();

  const [levels, setLevels] = useState<SkillLevel[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [wodsLogged, setWodsLogged] = useState(0);
  const [prsLogged, setPrsLogged] = useState(0);
  const [skillProgress, setSkillProgress] = useState<SkillProgress | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkill = useCallback(async () => {
    setError(null);
    try {
      const [meSkill, skillLevels] = await Promise.all([
        getMeSkill(),
        getSkillLevels(),
      ]);
      setTotalXp(meSkill.totalXp);
      setWodsLogged(meSkill.wodsLogged);
      setPrsLogged(meSkill.prsLogged);
      setSkillProgress(meSkill.skillProgress);
      setLevels(skillLevels);
    } catch (err) {
      console.error("Error loading skill level:", err);
      setError(
        err instanceof Error ? err.message : "Could not load skill level",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadSkill();
    }, [loadSkill]),
  );

  if (loading) {
    return (
      <ThemedView style={[styles.page, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </ThemedView>
    );
  }

  if (error || !skillProgress) {
    return (
      <ThemedView style={[styles.page, { justifyContent: "center" }]}>
        <ThemedText style={{ textAlign: "center", marginBottom: 16 }}>
          {error ?? "Could not load skill level"}
        </ThemedText>
        <Pressable
          style={styles.buttonPrimary}
          onPress={() => {
            setLoading(true);
            void loadSkill();
          }}
        >
          <ThemedText
            lightColor={colors.onAccent}
            darkColor={colors.onAccent}
            style={styles.buttonPrimaryText}
          >
            Retry
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const {
    currentLevel,
    nextLevel,
    xpIntoLevel,
    xpToNextLevel,
    progressPercent,
    isMaxLevel,
  } = skillProgress;

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.skillHeroCard}>
          <Text style={styles.skillLevelNumber}>
            Level {currentLevel.level}
          </Text>
          <ThemedText style={styles.skillLevelTitle}>
            {currentLevel.title}
          </ThemedText>
          <ThemedText style={styles.skillXpText}>
            {totalXp.toLocaleString()} total experience
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold">Progress to next level</ThemedText>
        <View style={styles.skillProgressTrack}>
          <View
            style={[
              styles.skillProgressFill,
              { width: `${Math.round(progressPercent * 100)}%` },
            ]}
          />
        </View>
        <ThemedText style={styles.skillXpText}>
          {isMaxLevel
            ? "Max level reached — keep training!"
            : `${xpIntoLevel} / ${xpToNextLevel} XP to Level ${nextLevel?.level} – ${nextLevel?.title}`}
        </ThemedText>

        <View style={styles.card}>
          <ThemedText type="defaultSemiBold">How you earn XP</ThemedText>
          <View style={styles.skillEarnRow}>
            <ThemedText>Log a WOD</ThemedText>
            <ThemedText style={styles.textAccent}>+{XP_PER_WOD} XP</ThemedText>
          </View>
          <View style={styles.skillEarnRow}>
            <ThemedText>Log a Personal Record</ThemedText>
            <ThemedText style={styles.textAccent}>+{XP_PER_PR} XP</ThemedText>
          </View>
          <View style={styles.skillEarnRow}>
            <ThemedText>WODs logged</ThemedText>
            <ThemedText type="defaultSemiBold">{wodsLogged}</ThemedText>
          </View>
          <View style={styles.skillEarnRow}>
            <ThemedText>PRs logged</ThemedText>
            <ThemedText type="defaultSemiBold">{prsLogged}</ThemedText>
          </View>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          All Levels
        </ThemedText>
        <View style={styles.listGapSm}>
          {levels.map((level) => {
            const isCurrent = level.level === currentLevel.level;
            const isComplete = totalXp >= level.xpRequired && !isCurrent;
            const isLocked = totalXp < level.xpRequired;

            return (
              <View
                key={level.level}
                style={[
                  styles.skillLevelRow,
                  isCurrent && styles.skillLevelRowCurrent,
                  isComplete && styles.skillLevelRowComplete,
                  isLocked && !isCurrent && styles.skillLevelRowLocked,
                ]}
              >
                <View
                  style={[
                    styles.skillLevelBadge,
                    isCurrent && styles.skillLevelBadgeCurrent,
                  ]}
                >
                  {isComplete ? (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={colors.accent}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.skillLevelBadgeText,
                        isCurrent && styles.skillLevelBadgeTextOnAccent,
                      ]}
                    >
                      {level.level}
                    </Text>
                  )}
                </View>
                <View style={styles.calendarLogInfo}>
                  <ThemedText type="defaultSemiBold">
                    Level {level.level} – {level.title}
                  </ThemedText>
                  <ThemedText style={styles.activityDate}>
                    {level.xpRequired === 0
                      ? "Starting level"
                      : `${level.xpRequired.toLocaleString()} XP required`}
                  </ThemedText>
                </View>
                {isCurrent && (
                  <ThemedText style={styles.textAccent}>Current</ThemedText>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
