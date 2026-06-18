import { Stack } from "expo-router";

import { HamburgerButton } from "@/components/hamburger-button";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function PersonalRecordsLayout() {
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
          title: "Personal Records",
          headerLeft: () => <HamburgerButton />,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "Exercise" }} />
    </Stack>
  );
}
