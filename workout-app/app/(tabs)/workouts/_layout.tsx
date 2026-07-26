import { Stack } from "expo-router";

import { useAppStyles } from "@/hooks/use-app-styles";

export default function WorkoutsLayout() {
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
          title: "Workouts",
          headerShown: false,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "WOD" }} />
    </Stack>
  );
}
