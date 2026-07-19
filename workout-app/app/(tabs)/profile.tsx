import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatSelectedDate } from "@/constants/calendar";
import { formatSkillLevelLabel } from "@/constants/skill-level";
import { useAuth } from "@/contexts/auth-context";
import { useAppStyles } from "@/hooks/use-app-styles";
import {
  getMeSkill,
  getProfile,
  getProfileStats,
  getRecentActivity,
  type Profile,
  type ProfileStats,
  type RecentActivityItem,
} from "@/lib/api/profile-api";

const AVATAR = require("@/assets/images/react-logo.png");

function formatActivityDate(date: string): string {
  // Backend sends LocalDate as "yyyy-MM-dd"
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return formatSelectedDate(date);
  }
  return date;
}

export default function Profile() {
  const { styles, colors } = useAppStyles();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    [],
  );
  const [skillLabel, setSkillLabel] = useState("Skill Level");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setError(null);
      try {
        const [me, meStats, activity, skill] = await Promise.all([
          getProfile(),
          getProfileStats(),
          getRecentActivity(),
          getMeSkill(),
        ]);

        if (cancelled) return;

        setProfile(me);
        setStats(meStats);
        setRecentActivity(activity);
        setSkillLabel(formatSkillLevelLabel(skill.skillProgress));
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Could not load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const retryLoad = () => {
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const [me, meStats, activity, skill] = await Promise.all([
          getProfile(),
          getProfileStats(),
          getRecentActivity(),
          getMeSkill(),
        ]);
        setProfile(me);
        setStats(meStats);
        setRecentActivity(activity);
        setSkillLabel(formatSkillLevelLabel(skill.skillProgress));
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  };

  const displayName =
    profile?.displayName ||
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Athlete";

  const statsCards = [
    {
      label: "Workouts",
      value: stats ? String(stats.workoutsLogged) : "—",
    },
    {
      label: "PRs",
      value: stats ? String(stats.prsLogged) : "—",
    },
    {
      label: "Streak",
      value: stats ? `${stats.streakDays}d` : "—",
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not log out");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.page, styles.centeredScreen]}>
        <ActivityIndicator color={colors.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>{error}</ThemedText>
            <Pressable style={styles.buttonOutline} onPress={retryLoad}>
              <ThemedText style={styles.buttonOutlineText}>Retry</ThemedText>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.profileHeader}>
          <Image
            source={
              profile?.avatarUrl ? { uri: profile.avatarUrl } : AVATAR
            }
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.username}>
              {displayName}
            </ThemedText>
            {profile?.username ? (
              <ThemedText style={styles.statLabel}>@{profile.username}</ThemedText>
            ) : null}
            <Link href="/skill-level" asChild>
              <Pressable>
                <ThemedText type="link">{skillLabel}</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.statsRow}>
          {statsCards.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <ThemedText type="title" style={styles.statValue}>
                {stat.value}
              </ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        <Link href="/personal-records" asChild>
          <Pressable style={styles.linkCard}>
            <ThemedText type="defaultSemiBold">
              View Personal Records →
            </ThemedText>
          </Pressable>
        </Link>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        <View style={styles.listGapSm}>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No recent activity yet. Log a WOD or PR to see it here.
              </ThemedText>
            </View>
          ) : (
            recentActivity.map((item) => (
              <View key={item.id} style={styles.listCard}>
                <View>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <ThemedText style={styles.activityDate}>
                    {formatActivityDate(item.date)}
                  </ThemedText>
                </View>
                <ThemedText type="defaultSemiBold">{item.result}</ThemedText>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={[styles.buttonDanger, loggingOut && { opacity: 0.7 }]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <ThemedText style={styles.textDanger}>
            {loggingOut ? "Logging out…" : "Log Out"}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
