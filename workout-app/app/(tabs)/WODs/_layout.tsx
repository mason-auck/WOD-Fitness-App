import { Stack } from "expo-router";

import { HamburgerButton } from "@/components/hamburger-button";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function WodsLayout() {
  const { colors } = useAppStyles();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "WODs",
          headerLeft: () => <HamburgerButton />,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "WOD" }} />
    </Stack>
  );
}
