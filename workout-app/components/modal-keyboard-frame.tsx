import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useAppStyles } from "@/hooks/use-app-styles";

type FrameProps = {
  children: ReactNode;
  onClose: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  closeOnBackdrop?: boolean;
};

const ModalScrollContext = createContext<RefObject<ScrollView | null> | null>(
  null,
);

export { ModalScrollContext };

/**
 * Bottom-sheet modal frame that lifts with the keyboard so low TextInputs
 * stay visible. Backdrop dismisses keyboard and closes.
 */
export function ModalKeyboardFrame({
  children,
  onClose,
  sheetStyle,
  closeOnBackdrop = true,
}: FrameProps) {
  const { styles } = useAppStyles();

  const dismiss = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      {closeOnBackdrop ? (
        <Pressable style={styles.modalBackdropPress} onPress={dismiss} />
      ) : (
        <View style={styles.modalBackdropPress} />
      )}
      <View style={[styles.sheet, sheetStyle]} collapsable={false}>
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}

export const modalKeyboardDismissMode =
  Platform.OS === "ios" ? ("interactive" as const) : ("on-drag" as const);

type FormScrollProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** Scrollable modal form body that can scroll focused inputs into view. */
export function ModalFormScroll({
  children,
  style,
  contentContainerStyle,
}: FormScrollProps) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ModalScrollContext.Provider value={scrollRef}>
      <ScrollView
        ref={scrollRef}
        style={style}
        contentContainerStyle={[{ paddingBottom: 48 }, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={modalKeyboardDismissMode}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ModalScrollContext.Provider>
  );
}

type BottomSheetInputProps = TextInputProps;

/**
 * TextInput that scrolls its parent ModalFormScroll so it stays above the keyboard.
 */
export function BottomSheetInput({
  onFocus,
  ...props
}: BottomSheetInputProps) {
  const scrollRef = useContext(ModalScrollContext);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
      onFocus?.(e);
      // Wait for keyboard animation, then bring field into view
      setTimeout(() => {
        scrollRef?.current?.scrollToEnd({ animated: true });
      }, 100);
      setTimeout(() => {
        scrollRef?.current?.scrollToEnd({ animated: true });
      }, 350);
    },
    [onFocus, scrollRef],
  );

  return <TextInput onFocus={handleFocus} {...props} />;
}
