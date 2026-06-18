import { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useAppStyles } from "@/hooks/use-app-styles";

type Props = {
  onDismiss: () => void;
  children: ReactNode;
  tall?: boolean;
};

export function KeyboardSheet({ onDismiss, children, tall }: Props) {
  const { styles } = useAppStyles();

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={styles.modalBackdropPress} onPress={onDismiss} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View style={[styles.sheet, tall && styles.sheetTall]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardDismissMode="on-drag"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
