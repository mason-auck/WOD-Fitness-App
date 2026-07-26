import { type ReactNode, useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import {
  ModalScrollContext,
  modalKeyboardDismissMode,
} from "@/components/modal-keyboard-frame";
import { useAppStyles } from "@/hooks/use-app-styles";

type Props = {
  onDismiss: () => void;
  children: ReactNode;
  tall?: boolean;
};

/**
 * Bottom sheet inside a Modal. Lifts with the keyboard; fields using
 * BottomSheetInput scroll into view on focus.
 */
export function KeyboardSheet({ onDismiss, children, tall }: Props) {
  const { styles } = useAppStyles();
  const scrollRef = useRef<ScrollView>(null);

  const dismissSheet = () => {
    Keyboard.dismiss();
    onDismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <Pressable style={styles.modalBackdropPress} onPress={dismissSheet} />
      <View style={[styles.sheet, tall && styles.sheetTall]}>
        <ModalScrollContext.Provider value={scrollRef}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={modalKeyboardDismissMode}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 48 }}
          >
            {children}
          </ScrollView>
        </ModalScrollContext.Provider>
      </View>
    </KeyboardAvoidingView>
  );
}
