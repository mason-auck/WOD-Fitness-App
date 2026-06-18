import { Pressable, ScrollView, Switch, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UNIT_OPTIONS } from "@/constants/settings";
import { useSettings } from "@/contexts/settings-context";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function SettingsScreen() {
  const { colors, styles } = useAppStyles();
  const { unitSystem, setUnitSystem, keepScreenOn, setKeepScreenOn, weightUnitLabel } =
    useSettings();

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.listLabel}>
          Customize how the app works for you.
        </ThemedText>

        <View style={styles.settingsSection}>
          <ThemedText type="defaultSemiBold">Units of Measurement</ThemedText>
          <View style={styles.settingsUnitPicker}>
            {UNIT_OPTIONS.map((option) => {
              const selected = unitSystem === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.settingsUnitOption,
                    selected && styles.settingsUnitOptionSelected,
                  ]}
                  onPress={() => setUnitSystem(option.value)}
                >
                  <ThemedText style={styles.settingsUnitOptionLabel}>
                    {option.label}
                  </ThemedText>
                  <ThemedText style={styles.settingsUnitOptionDescription}>
                    {option.description}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText style={styles.settingsRowDescription}>
            Weight values across the app will display in {weightUnitLabel}.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowInfo}>
              <ThemedText type="defaultSemiBold">Keep Screen On</ThemedText>
              <ThemedText style={styles.settingsRowDescription}>
                Prevent your phone from sleeping while the app is open — useful
                during timers and workouts.
              </ThemedText>
            </View>
            <Switch
              value={keepScreenOn}
              onValueChange={setKeepScreenOn}
              trackColor={{ false: colors.icon, true: colors.accent }}
              thumbColor={colors.onAccent}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
