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
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Animation, Layout } from "@/constants/theme";
import { useAppStyles } from "@/hooks/use-app-styles";

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
  const { colors, styles } = useAppStyles();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(-Layout.drawerWidth);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    translateX.value = -Layout.drawerWidth;
    backdropOpacity.value = 0;
    setVisible(true);
  }, [translateX, backdropOpacity]);

  const close = useCallback(() => {
    translateX.value = withTiming(
      -Layout.drawerWidth,
      {
        duration: Animation.drawerDuration,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      },
    );
    backdropOpacity.value = withTiming(0, {
      duration: Animation.drawerDuration,
    });
  }, [translateX, backdropOpacity]);

  useEffect(() => {
    if (!visible) return;

    translateX.value = withTiming(0, {
      duration: Animation.drawerDuration,
      easing: Easing.out(Easing.cubic),
    });
    backdropOpacity.value = withTiming(Animation.drawerBackdropOpacity, {
      duration: Animation.drawerDuration,
    });
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
            style={[styles.drawerBackdrop, backdropAnimatedStyle]}
            pointerEvents="none"
          />
          <View style={styles.drawerOverlay}>
            <Animated.View
              style={[styles.drawerPanel, drawerAnimatedStyle]}
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
                    style={styles.drawerMenuItem}
                    onPress={() => onNavigate(item.href)}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={Layout.iconMd}
                      color={colors.icon}
                    />
                    <Text style={styles.drawerMenuItemText}>{item.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Animated.View>
            <Pressable style={styles.drawerDismiss} onPress={close} />
          </View>
        </View>
      </Modal>
    </DrawerMenuContext.Provider>
  );
}
