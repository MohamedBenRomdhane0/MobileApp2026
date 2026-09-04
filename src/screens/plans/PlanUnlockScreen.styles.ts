import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

type ThemeColors = AppColors | undefined;

export function getUnlockPalette(colors: ThemeColors, isDark: boolean) {
  if (!isDark) {
    return {
      bg: "#ECF0F6",
      card: "#FFFFFF",
      cardSelected: "#FFFFFF",
      text: "#0F172A",
      textMuted: "rgba(15,23,42,0.62)",
      textSub: "rgba(15,23,42,0.45)",
      gold: "#A67C00",
      goldBorder: "#D4A843",
      goldBg: "rgba(212,168,67,0.18)",
      closeBg: "rgba(15,23,42,0.1)",
      border: "rgba(15,23,42,0.08)",
      borderSelected: "#D4A843",
      ctaBg: "#D4A843",
      ctaText: "#0A0A0A",
      footerText: "rgba(15,23,42,0.45)",
      featureIconBg: "rgba(15,23,42,0.05)",
    };
  }
  return {
    bg: "#0B1220",
    card: "#111B2E",
    cardSelected: "#111B2E",
    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.6)",
    textSub: "rgba(255,255,255,0.45)",
    gold: "#D4A843",
    goldBorder: "#D4A843",
    goldBg: "rgba(212,168,67,0.15)",
    closeBg: "rgba(255,255,255,0.15)",
    border: "transparent",
    borderSelected: "#D4A843",
    ctaBg: "#D4A843",
    ctaText: "#0A0A0A",
    footerText: "rgba(255,255,255,0.4)",
    featureIconBg: "rgba(255,255,255,0.08)",
  };
}

export function createUnlockStyles(
  colors: ThemeColors,
  isDark: boolean,
  isRTL: boolean,
) {
  const palette = getUnlockPalette(colors, isDark);
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

    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blobA: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 999,
      backgroundColor: "rgba(150,170,200,0.15)",
      top: -40,
      left: isRTL ? undefined : -20,
      right: isRTL ? -20 : undefined,
    },
    blobB: {
      position: "absolute",
      width: 90,
      height: 90,
      borderRadius: 999,
      backgroundColor: "rgba(120,150,190,0.12)",
      top: 10,
      right: isRTL ? undefined : 30,
      left: isRTL ? 30 : undefined,
    },
    blobC: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 999,
      backgroundColor: "rgba(180,190,210,0.1)",
      top: -20,
      left: "50%",
      marginLeft: -35,
    },

    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 48,
    },

    closeBtn: {
      position: "absolute",
      top: 48,
      right: 20,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.closeBg,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    headline: {
      fontSize: 26,
      fontWeight: "800",
      color: palette.text,
      lineHeight: 32,
      textAlign: "center",
      writingDirection: dir,
    },
    headlineHighlight: {
      color: palette.gold,
    },

    subtitle: {
      fontSize: 14,
      color: palette.textMuted,
      textAlign: "center",
      marginTop: 8,
      writingDirection: dir,
    },

    featuresGrid: {
      marginTop: 28,
      flexDirection: row,
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 18,
    },
    featureItem: {
      width: "30%",
      alignItems: "center",
      gap: 10,
    },
    featureIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 22,
      backgroundColor: palette.featureIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    featureLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: palette.text,
      textAlign: "center",
      writingDirection: dir,
    },

    detailsSection: {
      marginTop: 28,
      gap: 12,
    },
    detailsTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.text,
      writingDirection: dir,
    },
    pricingSection: {
      marginTop: 28,
      gap: 12,
    },
    detailRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 10,
    },
    detailDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: palette.gold,
    },
    detailText: {
      fontSize: 13,
      color: palette.textMuted,
      flex: 1,
      writingDirection: dir,
    },

    plansSection: {
      flexDirection: row,
      flexWrap: "wrap",
      gap: 12,
    },
    planCard: {
      flexBasis: "48%",
      flexGrow: 1,
      borderRadius: 16,
      borderWidth: 2,
      padding: 16,
      backgroundColor: palette.card,
    },
    planCardSelected: {
      borderColor: palette.borderSelected,
      backgroundColor: palette.cardSelected,
    },
    planCardUnselected: {
      borderColor: palette.border,
    },
    planTopRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 6,
    },
    planName: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.text,
      writingDirection: dir,
    },
    planBadge: {
      backgroundColor: palette.gold,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    planBadgeText: {
      fontSize: 9,
      fontWeight: "800",
      color: "#0A0A0A",
      letterSpacing: 0.3,
    },
    planTrial: {
      fontSize: 11,
      color: palette.gold,
      marginTop: 4,
      writingDirection: dir,
    },
    planPriceRow: {
      flexDirection: row,
      alignItems: "baseline",
      gap: 4,
      marginTop: 8,
    },
    planPrice: {
      fontSize: 22,
      fontWeight: "800",
      color: palette.text,
    },
    planPeriod: {
      fontSize: 12,
      color: palette.textSub,
      writingDirection: dir,
    },

    ctaWrap: {
      marginTop: 8,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    ctaButton: {
      backgroundColor: palette.ctaBg,
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: "center",
    },
    ctaTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: palette.ctaText,
    },
    ctaSub: {
      fontSize: 12,
      fontWeight: "500",
      color: palette.ctaText,
      opacity: 0.7,
      marginTop: 3,
    },

    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 16,
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
  });
}

export type UnlockStyles = ReturnType<typeof createUnlockStyles>;
