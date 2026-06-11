import { StyleSheet } from "react-native";

import {
  Animation,
  BorderRadius,
  FontSize,
  FontWeight,
  Layout,
  Spacing,
  type ThemeColors,
} from "@/constants/theme";

export function createGlobalStyles(colors: ThemeColors) {
  return StyleSheet.create({
    // Layout
    page: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.xl,
      gap: Spacing.lg,
      paddingBottom: Spacing.screenBottom,
    },
    scrollContentCompact: {
      padding: Spacing.xl,
      gap: Spacing.lg,
      paddingBottom: Spacing.screenBottom,
    },
    centeredScreen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // Rows
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowStart: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    rowBetweenStart: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: Spacing.md,
    },
    wodTitleRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs + 2,
    },
    filterChipGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
    },
    searchRow: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "stretch",
    },
    statsRow: {
      flexDirection: "row",
      gap: Spacing.md,
    },
    badgeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
    },
    activeFiltersRow: {
      gap: Spacing.sm,
      alignItems: "center",
      paddingVertical: 2,
    },

    // Profile
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.lg,
    },
    avatar: {
      width: Layout.avatarSize,
      height: Layout.avatarSize,
      borderRadius: Layout.avatarSize / 2,
    },
    profileInfo: {
      flex: 1,
      gap: Spacing.xs,
    },
    username: {
      fontSize: FontSize.hero,
    },

    // Cards & lists
    card: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
      gap: Spacing.md,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
      gap: Spacing.xs,
    },
    listCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: Spacing.base + 2,
      borderRadius: BorderRadius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
    },
    listGap: {
      gap: Spacing.md,
    },
    listGapSm: {
      gap: Spacing.md - 2,
    },
    emptyState: {
      padding: Spacing.xxl,
      borderRadius: BorderRadius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
      alignItems: "center",
    },

    // Text helpers
    statValue: {
      fontSize: FontSize.heading,
    },
    statLabel: {
      fontSize: FontSize.sm,
      opacity: 0.7,
    },
    listLabel: {
      opacity: 0.7,
    },
    sectionTitle: {
      marginTop: Spacing.xs,
    },
    activityDate: {
      fontSize: FontSize.base,
      opacity: 0.6,
      marginTop: 2,
    },
    description: {
      fontSize: FontSize.lg,
      lineHeight: 22,
    },
    emptyStateText: {
      textAlign: "center",
      opacity: 0.7,
    },
    textAccent: {
      color: colors.accent,
    },
    textMuted: {
      color: colors.icon,
    },
    textDanger: {
      color: colors.danger,
      fontWeight: FontWeight.semibold,
    },
    wodTitle: {
      fontSize: FontSize.xxl,
    },

    // Buttons
    buttonPrimary: {
      padding: Spacing.base + 2,
      borderRadius: BorderRadius.lg,
      alignItems: "center",
      backgroundColor: colors.accent,
    },
    buttonPrimaryText: {
      fontWeight: FontWeight.semibold,
      fontSize: FontSize.xl,
    },
    buttonOutline: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      padding: Spacing.base + 2,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    buttonOutlineText: {
      fontWeight: FontWeight.semibold,
      fontSize: FontSize.xl,
      color: colors.accent,
    },
    buttonDanger: {
      marginTop: Spacing.sm,
      padding: Spacing.base + 2,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.danger,
      alignItems: "center",
    },
    buttonCancel: {
      alignItems: "center",
      paddingVertical: Spacing.base + 2,
      marginTop: Spacing.xs,
    },
    linkCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: colors.accent,
      alignItems: "center",
    },

    // Inputs & search
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base + 2,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
      backgroundColor: colors.surface,
    },
    searchInput: {
      flex: 1,
      fontSize: FontSize.xl,
      paddingVertical: Spacing.xs,
      color: colors.text,
    },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.base + 2,
      paddingVertical: Spacing.md,
      fontSize: FontSize.xl,
      marginBottom: Spacing.lg,
      borderColor: colors.icon,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    textArea: {
      minHeight: 120,
    },
    fieldLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      marginBottom: Spacing.xs + 2,
      opacity: 0.8,
    },

    // Chips & badges
    chip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
    },
    chipSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    chipUnselected: {
      borderColor: colors.icon,
      backgroundColor: colors.surface,
    },
    chipText: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.medium,
    },
    chipPicker: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    typeBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.accent,
    },
    typeBadgeText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
    },
    categoryBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.icon,
      backgroundColor: colors.surface,
    },
    categoryBadgeText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      opacity: 0.85,
    },
    activeFilterChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs + 2,
      borderRadius: BorderRadius.xxl,
      backgroundColor: colors.accent,
    },
    activeFilterChipText: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.medium,
    },

    // Filter button
    filterButton: {
      width: Layout.filterButtonSize,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    filterButtonActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    filterButtonInactive: {
      borderColor: colors.icon,
      backgroundColor: colors.surface,
    },
    filterBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      minWidth: Spacing.lg,
      height: Spacing.lg,
      borderRadius: Spacing.sm,
      backgroundColor: "rgba(0,0,0,0.25)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xs,
    },
    filterBadgeText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.bold,
    },

    // Modals & sheets
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: colors.overlay,
    },
    modalContainer: {
      flex: 1,
    },
    sheet: {
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
      padding: Spacing.xl,
      paddingBottom: Spacing.xxl,
      backgroundColor: colors.background,
    },
    sheetTall: {
      maxHeight: "85%",
    },
    sheetFilter: {
      maxHeight: "80%",
      gap: Spacing.md,
    },
    sheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.xs,
    },
    sheetTitle: {
      marginBottom: Spacing.md,
      fontSize: FontSize.xxl,
    },
    sheetSection: {
      marginBottom: Spacing.lg,
    },
    sheetSectionTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      opacity: 0.7,
      marginBottom: Spacing.md,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base + 2,
      paddingVertical: Spacing.base + 2,
    },

    // Drawer
    drawerBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.backdrop,
    },
    drawerOverlay: {
      flex: 1,
      flexDirection: "row",
    },
    drawerPanel: {
      width: Layout.drawerWidthPercent,
      maxWidth: Layout.drawerWidth,
      backgroundColor: colors.background,
    },
    drawerDismiss: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: colors.drawerHeader,
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.lg,
    },
    drawerHeaderText: {
      color: colors.onAccent,
      fontSize: FontSize.title,
      fontWeight: FontWeight.semibold,
    },
    drawerMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.lg,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.icon,
    },
    drawerMenuItemText: {
      fontSize: FontSize.xl,
      color: colors.text,
    },

    // Header chrome
    hamburgerHitArea: {
      marginLeft: Spacing.xs,
    },
  });
}

export type GlobalStyles = ReturnType<typeof createGlobalStyles>;
