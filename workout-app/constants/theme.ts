/**
 * Global design tokens — change values here to restyle the whole app.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const accentColor = "#4A9ECF";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    surface: "#f4f6f7",
    tint: tintColorLight,
    accent: accentColor,
    onAccent: "#fff",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    danger: "#e53935",
    favorite: "#f5a623",
    overlay: "rgba(0, 0, 0, 0.5)",
    backdrop: "#000",
    drawerHeader: accentColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    surface: "#2a2d2e",
    tint: tintColorDark,
    accent: accentColor,
    onAccent: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    danger: "#e53935",
    favorite: "#f5a623",
    overlay: "rgba(0, 0, 0, 0.5)",
    backdrop: "#000",
    drawerHeader: accentColor,
  },
};

export type ThemeColors = (typeof Colors)["light"];

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
  screenBottom: 40,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  title: 20,
  heading: 24,
  hero: 28,
  display: 32,
} as const;

export const FontWeight = {
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const Typography = {
  default: {
    fontSize: FontSize.xl,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: FontSize.xl,
    lineHeight: 24,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.display,
  },
  subtitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
  },
  link: {
    fontSize: FontSize.xl,
    lineHeight: 30,
  },
  muted: {
    opacity: 0.7,
  },
  subtle: {
    opacity: 0.6,
  },
} as const;

export const Layout = {
  drawerWidth: 320,
  drawerWidthPercent: "78%",
  filterButtonSize: 48,
  avatarSize: 80,
  iconSm: 22,
  iconMd: 24,
  iconLg: 28,
} as const;

export const Animation = {
  drawerDuration: 280,
  drawerBackdropOpacity: 0.5,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
