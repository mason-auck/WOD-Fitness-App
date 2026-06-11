import { Drawer } from "expo-router/drawer";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true, // displays top bar with hamburger menu
        drawerActiveTintColor: "#4A9ECF",
      }}
    >
      {/* Bottom tabs - main app, hidden from drawer menu */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "WOD Log",
          drawerItemStyle: { display: "none" }, // don't list tabs in menu
        }}
      />

      {/* Drawer Only Screens */}
      {/* Personal Records */}
      <Drawer.Screen
        name="personal-records"
        options={{
          drawerLabel: "Personal Records",
          title: "Personal Records",
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar" color={color} />
          ),
        }}
      />

      {/* Calendar */}
      <Drawer.Screen
        name="calendar"
        options={{
          drawerLabel: "Calendar",
          title: "Calendar",
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />

      {/* Settings */}
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />

      {/* skill level */}
      <Drawer.Screen
        name="skill-level"
        options={{
          drawerLabel: "Skill Level",
          title: "Skill Level",
          drawerIcon: ({ color }) => (
            <IconSymbol size={28} name="star" color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
