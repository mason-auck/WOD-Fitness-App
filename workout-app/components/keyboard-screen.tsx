import { type ReactNode, type Ref } from "react";
import {
  Platform,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  scrollRef?: Ref<ScrollView>;
} & Pick<
  ScrollViewProps,
  "showsVerticalScrollIndicator" | "stickyHeaderIndices" | "refreshControl"
>;

/**
 * Page ScrollView with keyboard-friendly defaults.
 * Avoids KeyboardAvoidingView here — Android resizes via app.json, and iOS
 * uses automaticallyAdjustKeyboardInsets so content isn't double-shifted.
 */
export function KeyboardScreen({
  children,
  contentContainerStyle,
  style,
  scrollRef,
  showsVerticalScrollIndicator = false,
  ...scrollProps
}: Props) {
  return (
    <ScrollView
      ref={scrollRef}
      style={[{ flex: 1 }, style]}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      automaticallyAdjustKeyboardInsets
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}
