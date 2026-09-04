import { Dimensions, StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

const { width: SCREEN_W } = Dimensions.get("window");

type ThemeColors = AppColors | undefined;

const CYAN = "#22BEC8";

export function getProPricingPalette(colors: ThemeColors) {
  return {
    bg: "#0B1220",
    card: "rgba(255,255,255,0.06)",
    cardSelected: "rgba(255,255,255,0.12)",
    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.55)",
    textSub: "rgba(255,255,255,0.45)",
    primary: colors?.primary ?? CYAN,
    badgeBg: "rgba(247,231,177,0.95)",
    badgeText: "#1A1200",
    closeBg: "rgba(255,255,255,0.2)",
    border: "rgba(255,255,255,0.1)",
    borderSelected: "rgba(255,255,255,0.9)",
    checkBg: "#FFFFFF",
    checkIcon: "#0A0A0A",
    ctaBg: "#FFFFFF",
    ctaText: "#0A0A0A",
    ctaSub: "rgba(0,0,0,0.4)",
    footerText: "rgba(255,255,255,0.3)",
  };
}

export function createProPricingStyles(colors: ThemeColors, isRTL: boolean) {
  const palette = getProPricingPalette(colors);
  const dir = isRTL ? ("rtl" as const) : ("ltr" as const);
  const row = isRTL ? ("row-reverse" as const) : ("row" as const);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.bg,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 16,
    },

    meshGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 460,
    },

    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 48,
    },

    topRow: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "center",
    },
    proBadge: {
      flexDirection: row,
      alignItems: "center",
      gap: 6,
      backgroundColor: palette.badgeBg,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    proBadgeText: {
      fontSize: 15,
      fontWeight: "800",
      color: palette.badgeText,
      letterSpacing: 0.5,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.closeBg,
      alignItems: "center",
      justifyContent: "center",
    },

    headline: {
      fontSize: 36,
      fontWeight: "800",
      color: palette.text,
      lineHeight: 40,
      marginTop: 16,
      writingDirection: dir,
    },
    headlineHighlight: {
      color: "#FFEB3B",
    },

    includedTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginTop: 24,
      writingDirection: dir,
    },
    featuresList: {
      marginTop: 16,
      gap: 16,
    },
    featureRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 14,
    },
    featureIcon: {
      fontSize: 22,
      color: palette.text,
    },
    featureLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: palette.text,
      writingDirection: dir,
    },

    plansSection: {
      marginTop: 20,
      gap: 10,
    },
    planCard: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1.5,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    planCardSelected: {
      borderColor: palette.borderSelected,
      backgroundColor: palette.cardSelected,
    },
    planCardUnselected: {
      borderColor: palette.border,
    },
    planLeft: {
      flex: 1,
    },
    planNameRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 7,
    },
    planName: {
      fontSize: 14,
      fontWeight: "500",
      color: palette.textMuted,
      writingDirection: dir,
    },
    planBadge: {
      backgroundColor: "#E8446A",
      borderRadius: 5,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    planBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    planPriceRow: {
      flexDirection: row,
      alignItems: "baseline",
      marginTop: 3,
      gap: 4,
    },
    planPrice: {
      fontSize: 20,
      fontWeight: "800",
      color: palette.text,
    },
    planNote: {
      fontSize: 12,
      color: palette.textSub,
      writingDirection: dir,
    },
    planCheck: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    planCheckSelected: {
      backgroundColor: palette.checkBg,
      borderColor: palette.checkBg,
    },
    planCheckUnselected: {
      borderColor: "rgba(255,255,255,0.35)",
    },

    ctaWrap: {
      marginTop: 16,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    ctaButton: {
      backgroundColor: palette.ctaBg,
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: "center",
    },
    ctaTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: palette.ctaText,
    },
    ctaSub: {
      fontSize: 12,
      color: palette.ctaSub,
      marginTop: 2,
    },

    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 12,
      paddingBottom: 6,
    },
    footerLink: {
      fontSize: 12,
      color: palette.footerText,
      writingDirection: dir,
    },
    footerDot: {
      fontSize: 12,
      color: palette.footerText,
    },

    paginationRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    dotActive: {
      width: 24,
      backgroundColor: "rgba(255,255,255,0.9)",
    },
  });
}

export type ProPricingStyles = ReturnType<typeof createProPricingStyles>;
