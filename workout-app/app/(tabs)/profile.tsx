import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppStyles } from "@/hooks/use-app-styles";

const USER = {
  username: "Jasmin",
  skillLevel: "Level 3 – Intermediate",
  avatar: require("@/assets/images/react-logo.png"),
};

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

  const handleLogout = () => {
    alert("Logout pressed");
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image source={USER.avatar} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.username}>
              {USER.username}
            </ThemedText>
            <Link href="/skill-level" asChild>
              <Pressable>
                <ThemedText type="link">{USER.skillLevel}</ThemedText>
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

        <Pressable style={styles.buttonDanger} onPress={handleLogout}>
          <ThemedText style={styles.textDanger}>Log Out</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}
