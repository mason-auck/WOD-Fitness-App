import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, type Href } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type DrawerMenuItem = {
  label: string;
  href: Href;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
};

const MENU_ITEMS: DrawerMenuItem[] = [
  {
    label: "Personal Records",
    href: "/personal-records",
    icon: "emoji-events",
  },
  { label: "Calendar", href: "/calendar", icon: "calendar-today" },
  { label: "Skill Level", href: "/skill-level", icon: "star" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

type DrawerMenuContextType = {
  open: () => void;
  close: () => void;
};

const DrawerMenuContext = createContext<DrawerMenuContextType | null>(null);

export function useDrawerMenu() {
  const context = useContext(DrawerMenuContext);
  if (!context) {
    throw new Error("useDrawerMenu must be used within DrawerMenuProvider");
  }
  return context;
}

export function DrawerMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const onNavigate = (href: Href) => {
    close();
    router.push(href);
  };

  return (
    <DrawerMenuContext.Provider value={{ open, close }}>
      {children}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View style={styles.overlay}>
          <View
            style={[styles.drawer, { backgroundColor: colors.background }]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderText}>WOD Log</Text>
            </View>
            <ScrollView>
              {MENU_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  style={[styles.menuItem, { borderBottomColor: colors.icon }]}
                  onPress={() => onNavigate(item.href)}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={colors.icon}
                  />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <Pressable style={styles.dismissArea} onPress={close} />
        </View>
      </Modal>
    </DrawerMenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: "78%",
    maxWidth: 320,
  },
  dismissArea: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#4A9ECF",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  drawerHeaderText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemText: {
    fontSize: 16,
  },
});
