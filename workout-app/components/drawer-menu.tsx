import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, type Href } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const DRAWER_WIDTH = 320;
const ANIMATION_DURATION = 280;

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
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    translateX.value = -DRAWER_WIDTH;
    backdropOpacity.value = 0;
    setVisible(true);
  }, [translateX, backdropOpacity]);

  const close = useCallback(() => {
    translateX.value = withTiming(
      -DRAWER_WIDTH,
      {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      },
    );
    backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
  }, [translateX, backdropOpacity]);

  useEffect(() => {
    if (!visible) return;

    translateX.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    backdropOpacity.value = withTiming(0.5, { duration: ANIMATION_DURATION });
  }, [visible, translateX, backdropOpacity]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const onNavigate = (href: Href) => {
    close();
    router.push(href);
  };

  return (
    <DrawerMenuContext.Provider value={{ open, close }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.backdrop, backdropAnimatedStyle]}
            pointerEvents="none"
          />
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.drawer,
                { backgroundColor: colors.background },
                drawerAnimatedStyle,
              ]}
            >
              <View
                style={[styles.drawerHeader, { paddingTop: insets.top + 12 }]}
              >
                <Text style={styles.drawerHeaderText}>WOD Log</Text>
              </View>
              <ScrollView>
                {MENU_ITEMS.map((item) => (
                  <Pressable
                    key={item.label}
                    style={[
                      styles.menuItem,
                      { borderBottomColor: colors.icon },
                    ]}
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
            </Animated.View>
            <Pressable style={styles.dismissArea} onPress={close} />
          </View>
        </View>
      </Modal>
    </DrawerMenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  drawer: {
    width: "78%",
    maxWidth: DRAWER_WIDTH,
  },
  dismissArea: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#4A9ECF",
    paddingBottom: 20,
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
