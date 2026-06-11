import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";

import { useDrawerMenu } from "@/components/drawer-menu";
import { Layout } from "@/constants/theme";
import { useAppStyles } from "@/hooks/use-app-styles";

export function HamburgerButton() {
  const { open } = useDrawerMenu();
  const { colors, styles } = useAppStyles();

  return (
    <Pressable
      onPress={open}
      hitSlop={8}
      style={styles.hamburgerHitArea}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
    >
      <MaterialIcons name="menu" size={Layout.iconLg} color={colors.tint} />
    </Pressable>
  );
}
