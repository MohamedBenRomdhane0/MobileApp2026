import { Dimensions, StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

const { width: SCREEN_W } = Dimensions.get("window");

type ThemeColors = AppColors | undefined;

const GOLD = "#F5A623";
const CYAN = "#22BEC8";
const CYAN_DARK = "#1aa8b0";

export function getPlanUIPalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg: "#0B1220",
    card: isDark ? "#111A2E" : "#151D30",
    cardBorder: isDark ? "rgba(42,58,94,0.5)" : "rgba(42,58,94,0.4)",
    text: "#F8FAFC",
    textSecondary: isDark ? "#9CA3AF" : "#8896AB",
    primary: colors?.primary ?? CYAN,
    gold: GOLD,
    goldStrong: "#E8960F",
    cyan: CYAN,
    cyanDark: CYAN_DARK,
    surface: isDark ? "#0E1A2E" : "#0E1A2E",
    heroOverlay: "rgba(11,18,32,0.7)",
    closeBg: "rgba(255,255,255,0.12)",
    iconBg: isDark ? "#162240" : "#162240",
    divider: "rgba(42,58,94,0.4)",
    muted: isDark ? "#6B7A96" : "#7A8AA0",
    footerText: "rgba(255,255,255,0.35)",
    selectedBorder: CYAN,
    unselectedBorder: "rgba(42,58,94,0.5)",
  };
}

const sh = {
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

export function createPlanUIStyles(
  colors: ThemeColors,
  isDark: boolean,
  isRTL: boolean,
) {
  const palette = getPlanUIPalette(colors, isDark);
  const dir = isRTL ? ("rtl" as const) : ("ltr" as const);
  const row = isRTL ? ("row-reverse" as const) : ("row" as const);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.bg,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 40,
    },

    heroContainer: {
      width: "100%",
      height: 60,
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    heroGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
    },
    closeBtn: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.closeBg,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    headlineSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 4,
    },
    headlineText: {
      fontSize: 27,
      fontWeight: "800",
      color: palette.text,
      writingDirection: dir,
    },
    headlineHighlight: {
      color: palette.gold,
    },
    headlineSub: {
      fontSize: 15,
      color: palette.textSecondary,
      marginTop: 4,
      writingDirection: dir,
    },

    reviewsTrack: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    reviewsScroll: {
      flexDirection: row,
    },
    reviewCard: {
      width: SCREEN_W * 0.78,
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    },
    reviewTopRow: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    reviewTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: palette.text,
      flex: 1,
      writingDirection: dir,
    },
    reviewDate: {
      fontSize: 12,
      color: palette.muted,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
    reviewStarsRow: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },
    reviewAuthor: {
      fontSize: 12,
      color: palette.muted,
    },
    reviewBody: {
      fontSize: 13.5,
      lineHeight: 20,
      color: palette.textSecondary,
      marginTop: 10,
      writingDirection: dir,
    },
    dotsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      marginTop: 8,
    },
    dot: {
      height: 6,
      borderRadius: 3,
      backgroundColor: palette.muted,
      opacity: 0.3,
    },
    dotActive: {
      width: 16,
      opacity: 1,
      backgroundColor: palette.primary,
    },
    dotInactive: {
      width: 6,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: palette.text,
      textAlign: "center",
      marginTop: 20,
      marginBottom: 12,
      writingDirection: dir,
    },

    plansSection: {
      paddingHorizontal: 20,
    },
    planCard: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
    },
    planCardSelected: {
      borderColor: palette.selectedBorder,
    },
    planCardUnselected: {
      borderColor: palette.unselectedBorder,
    },
    planLeft: {
      flex: 1,
    },
    planLabelRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 8,
    },
    planLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: palette.text,
      writingDirection: dir,
    },
    savingsBadge: {
      backgroundColor: palette.gold,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    savingsText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#1A1A1A",
    },
    planPriceRow: {
      flexDirection: row,
      alignItems: "baseline",
      justifyContent: "space-between",
      marginTop: 4,
    },
    planPrice: {
      fontSize: 17,
      fontWeight: "800",
      color: palette.text,
    },
    planPeriod: {
      fontSize: 12,
      color: palette.textSecondary,
    },
    planTrialText: {
      fontSize: 12.5,
      color: palette.gold,
      marginTop: 4,
      writingDirection: dir,
    },

    ctaButton: {
      backgroundColor: palette.cyan,
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
      ...sh,
    },
    ctaText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 20,
      marginTop: 12,
      paddingVertical: 12,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800",
      color: palette.text,
    },
    statLabel: {
      fontSize: 12,
      color: palette.textSecondary,
      marginTop: 4,
      textAlign: "center",
      writingDirection: dir,
    },

    featuresSection: {
      paddingHorizontal: 20,
      marginTop: 8,
    },
    featureRow: {
      flexDirection: row,
      alignItems: "center",
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    },
    featureIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: palette.iconBg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      overflow: "hidden",
    },
    featureIcon: {
      width: 36,
      height: 36,
      resizeMode: "contain",
    },
    featureTextWrap: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: palette.text,
      writingDirection: dir,
    },
    featureBody: {
      fontSize: 13.5,
      lineHeight: 19,
      color: palette.textSecondary,
      marginTop: 2,
      writingDirection: dir,
    },

    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      marginTop: 22,
      paddingBottom: 16,
    },
    footerLink: {
      fontSize: 13,
      color: palette.footerText,
      writingDirection: dir,
    },
    footerDot: {
      fontSize: 13,
      color: palette.footerText,
    },
  });
}

export type PlanUIStyles = ReturnType<typeof createPlanUIStyles>;
