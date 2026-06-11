import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppStyles } from "@/hooks/use-app-styles";

export function ScreenPlaceholder({ title }: { title: string }) {
  const { styles } = useAppStyles();

  return (
    <ThemedView style={styles.centeredScreen}>
      <ThemedText type="subtitle">{title}</ThemedText>
    </ThemedView>
  );
}
