import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";

import { Colors } from "@/constants/theme";
import { useDrawerMenu } from "@/components/drawer-menu";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function HamburgerButton() {
  const { open } = useDrawerMenu();
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Pressable
      onPress={open}
      hitSlop={8}
      style={{ marginLeft: 4 }}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
    >
      <MaterialIcons
        name="menu"
        size={28}
        color={Colors[colorScheme].tint}
      />
    </Pressable>
  );
}
