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

    // Whiteboard / social feed
    feedAvatar: {
      width: Layout.avatarSm,
      height: Layout.avatarSm,
      borderRadius: Layout.avatarSm / 2,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    feedAvatarText: {
      color: colors.onAccent,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
    },
    feedEntryHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
    },
    feedWodRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      flexWrap: "wrap",
    },
    feedAuthorInfo: {
      flex: 1,
      gap: 2,
    },
    feedAuthorName: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
    },
    feedTimestamp: {
      fontSize: FontSize.sm,
      opacity: 0.6,
    },
    feedScoreBox: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.surface,
      alignItems: "center",
    },
    feedScoreValue: {
      fontSize: FontSize.heading,
      fontWeight: FontWeight.bold,
      color: colors.accent,
    },
    feedScoreLabel: {
      fontSize: FontSize.sm,
      opacity: 0.7,
      marginTop: 2,
    },
    feedCaption: {
      fontSize: FontSize.lg,
      lineHeight: 22,
      fontStyle: "italic",
      opacity: 0.9,
    },
    feedNotes: {
      fontSize: FontSize.base,
      lineHeight: 20,
      opacity: 0.8,
    },
    feedActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xl,
      paddingTop: Spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.icon,
    },
    feedActionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs + 2,
    },
    feedActionText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
    },
    feedActionTextActive: {
      color: colors.danger,
    },
    feedComment: {
      gap: 2,
      paddingVertical: Spacing.xs,
    },
    feedCommentAuthor: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
    },
    feedCommentText: {
      fontSize: FontSize.base,
      lineHeight: 20,
    },
    feedCommentInput: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.base + 2,
      paddingVertical: Spacing.md,
      fontSize: FontSize.xl,
      marginBottom: Spacing.md,
      borderColor: colors.icon,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    feedVisibilityBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.surface,
    },
    feedVisibilityText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      opacity: 0.75,
    },

    // Timer
    timerSetupFooter: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.icon,
      backgroundColor: colors.background,
    },
    timerSetupScroll: {
      padding: Spacing.xl,
      gap: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    timerTypeGroup: {
      gap: Spacing.sm,
    },
    timerTypeList: {
      gap: Spacing.md,
    },
    timerTypeCard: {
      paddingVertical: Spacing.base + 2,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.xs,
    },
    timerTypeCardSelected: {
      borderColor: colors.accent,
      borderWidth: 2,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg - 1,
    },
    timerTypeCardUnselected: {
      borderColor: colors.icon,
    },
    timerTypeDescription: {
      fontSize: FontSize.base,
      opacity: 0.7,
      lineHeight: 20,
    },
    timerStepperRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    timerStepperLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
    },
    timerStepperControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.lg,
    },
    timerStepperButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    timerStepperValue: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.semibold,
      minWidth: 72,
      textAlign: "center",
    },
    timerStartButton: {
      paddingVertical: Spacing.base + 2,
      borderRadius: BorderRadius.xl,
      alignItems: "center",
      backgroundColor: colors.accent,
    },
    timerStartButtonText: {
      fontWeight: FontWeight.bold,
      fontSize: FontSize.title,
      color: colors.onAccent,
    },
    timerFullScreen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: Spacing.xl,
    },
    timerFullScreenHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.lg,
    },
    timerDisplayArea: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
    },
    timerBottomPanel: {
      gap: Spacing.lg,
      paddingTop: Spacing.md,
    },
    timerMainDisplay: {
      fontSize: 72,
      fontWeight: FontWeight.bold,
      color: colors.accent,
      fontVariant: ["tabular-nums"],
    },
    timerPhaseLabel: {
      fontSize: FontSize.title,
      fontWeight: FontWeight.bold,
      letterSpacing: 2,
    },
    timerPhaseWork: {
      color: colors.danger,
    },
    timerPhaseRest: {
      color: colors.accent,
    },
    timerMetaText: {
      fontSize: FontSize.xl,
      opacity: 0.75,
    },
    timerRepRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xl,
    },
    timerRepCountGroup: {
      alignItems: "center",
      minWidth: 80,
      gap: 2,
    },
    timerRepValue: {
      fontSize: FontSize.hero,
      fontWeight: FontWeight.bold,
      fontVariant: ["tabular-nums"],
    },
    timerRepLabel: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      opacity: 0.6,
      letterSpacing: 1,
    },
    timerRepButton: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.full,
      borderWidth: 2,
      borderColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    timerRepButtonDisabled: {
      opacity: 0.35,
    },
    timerRepButtonText: {
      fontSize: FontSize.heading,
      fontWeight: FontWeight.bold,
      color: colors.accent,
    },
    timerActionButton: {
      paddingVertical: Spacing.base + 2,
      borderRadius: BorderRadius.xl,
      alignItems: "center",
    },
    timerActionStart: {
      backgroundColor: colors.accent,
    },
    timerActionFinish: {
      backgroundColor: colors.danger,
    },
    timerActionButtonText: {
      fontWeight: FontWeight.bold,
      fontSize: FontSize.xl,
      color: colors.onAccent,
    },
    timerCountdownOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    timerCountdownText: {
      fontSize: 120,
      fontWeight: FontWeight.bold,
      color: colors.onAccent,
    },
  });
}

export type GlobalStyles = ReturnType<typeof createGlobalStyles>;
