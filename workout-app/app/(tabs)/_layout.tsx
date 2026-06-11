import { Tabs } from "expo-router";
import React from "react";

import { DrawerMenuProvider } from "@/components/drawer-menu";
import { HapticTab } from "@/components/haptic-tab";
import { HamburgerButton } from "@/components/hamburger-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function TabLayout() {
  const { colors } = useAppStyles();

  return (
    <DrawerMenuProvider>
      <Tabs
        initialRouteName="profile"
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: true,
          headerLeft: () => <HamburgerButton />,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          tabBarButton: HapticTab,
          tabBarStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="WODs"
          options={{
            title: "WODs",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="whiteboard"
          options={{
            title: "Whiteboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="pencil" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="personal-records"
          options={{
            href: null,
            title: "Personal Records",
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            href: null,
            title: "Calendar",
          }}
        />
        <Tabs.Screen
          name="skill-level"
          options={{
            href: null,
            title: "Skill Level",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            title: "Settings",
          }}
        />
      </Tabs>
    </DrawerMenuProvider>
  );
}
