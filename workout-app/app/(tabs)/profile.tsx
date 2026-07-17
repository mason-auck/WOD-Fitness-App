import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatSkillLevelLabel } from "@/constants/skill-level";
import { useAuth } from "@/contexts/auth-context";
import { useProgress } from "@/contexts/progress-context";
import { useAppStyles } from "@/hooks/use-app-styles";

const AVATAR = require("@/assets/images/react-logo.png");

const STATS = [
  { label: "Workouts", value: "42" },
  { label: "PRs", value: "18" },
  { label: "Streak", value: "7d" },
];

const RECENT_ACTIVITY = [
  { id: "1", title: "Fran", date: "Jun 8", result: "4:32" },
  { id: "2", title: "Back Squat 5x5", date: "Jun 6", result: "185 lbs" },
  { id: "3", title: "Murph", date: "Jun 3", result: "42:10" },
];

export default function Profile() {
  const { styles } = useAppStyles();
  const { skillProgress } = useProgress();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const skillLevelLabel = formatSkillLevelLabel(skillProgress);

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Athlete";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not log out");
      setLoggingOut(false);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image source={AVATAR} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.username}>
              {displayName}
            </ThemedText>
            <Link href="/skill-level" asChild>
              <Pressable>
                <ThemedText type="link">{skillLevelLabel}</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
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
          {RECENT_ACTIVITY.map((item) => (
            <View key={item.id} style={styles.listCard}>
              <View>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.activityDate}>{item.date}</ThemedText>
              </View>
              <ThemedText type="defaultSemiBold">{item.result}</ThemedText>
            </View>
          ))}
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
