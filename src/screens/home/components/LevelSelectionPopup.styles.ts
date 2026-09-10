import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createLevelSelectStyles = (
  colors: AppColors,
  isDark: boolean,
  isRTL: boolean
) => {
  const screenBg = isDark ? "#061428" : "#e0f3f3";
  const cardBg = isDark ? colors.card : "hsl(0, 0%, 100%)";
  const surface = isDark ? "rgba(148,163,184,0.10)" : "#EFF3F8";
  const surface2 = isDark ? "rgba(148,163,184,0.16)" : "#E6ECF3";
  const titleColor = isDark ? "#FFFFFF" : "#1A2F4D";
  const contentTitleColor = isDark ? colors.text : "#1F3B64";
  const mutedColor = isDark ? colors.muted : "#64748B";
  const primaryColor = isDark ? "#21D1CA" : "#00B7B0";
  const textEnd = isRTL ? ("right" as const) : ("left" as const);

  return StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: screenBg,
      zIndex: 9999,
    },

    bgGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    topGlow: {
      position: "absolute",
      top: -140,
      start: -90,
      width: 340,
      height: 340,
      borderRadius: 170,
      backgroundColor: isDark
        ? "rgba(33,209,202,0.28)"
        : "rgba(0,183,176,0.22)",
      opacity: 0.8,
    },

    scrollContainer: {
      flexGrow: 1,
    },

    pageContainer: {
      width: "100%",
      maxWidth: 480,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 70,
    },

    header: {
      alignItems: "center",
      marginBottom: 32,
    },

    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark
        ? "rgba(33,209,202,0.18)"
        : "rgba(0,183,176,0.12)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 26,
      fontWeight: "800",
      color: titleColor,
      textAlign: "center",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 15,
      fontWeight: "500",
      color: mutedColor,
      textAlign: "center",
    },

    card: {
      backgroundColor: cardBg,
      borderRadius: 28,
      padding: 20,
      shadowColor: "#1A365D",
      shadowOpacity: isDark ? 0.4 : 0.14,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 16 },
      elevation: 6,
    },

    levelTabs: {
      flexDirection: "row",
      backgroundColor: surface,
      borderRadius: 22,
      padding: 5,
      gap: 4,
    },

    levelTab: {
      flex: 1,
      alignItems: "center",
      gap: 3,
      paddingVertical: 10,
      borderRadius: 17,
    },

    levelTabActive: {
      backgroundColor: cardBg,
      shadowColor: "#1A365D",
      shadowOpacity: isDark ? 0.4 : 0.14,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    levelTabDisabled: {
      opacity: 0.4,
    },

    levelTabText: {
      fontSize: 13,
      fontWeight: "800",
      color: contentTitleColor,
    },

    levelTabTextActive: {
      color: contentTitleColor,
    },

    levelTabTextDisabled: {
      color: mutedColor,
    },

    levelTabCount: {
      fontSize: 11,
      fontWeight: "700",
      color: mutedColor,
      opacity: 0.8,
    },

    levelTabCountActive: {
      color: primaryColor,
      opacity: 1,
    },

    levelSection: {
      marginTop: 16,
    },

    levelRow: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    levelButton: {
      width: "25%",
      aspectRatio: 1,
      borderRadius: 9999,
      borderWidth: 3,
      borderColor: "transparent",
      backgroundColor: surface,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: 5,
      opacity: 0.88,
    },

    levelButtonSelected: {
      borderColor: primaryColor,
      shadowColor: primaryColor,
      shadowOpacity: isDark ? 0.32 : 0.24,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      opacity: 1,
    },

    levelButtonDisabled: {
      opacity: 0.38,
    },

    levelBouleIcon: {
      width: "100%",
      height: "100%",
    },

    levelBouleIconSelected: {
      opacity: 1,
    },

    levelBouleIconDisabled: {
      opacity: 0.5,
    },

    levelDisabledHint: {
      marginTop: 8,
      fontSize: 12.5,
      color: mutedColor,
      fontWeight: "600",
      textAlign: textEnd,
    },

    selectedLabel: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: "700",
      color: primaryColor,
      textAlign: "center",
    },

    submitTouch: {
      marginTop: 24,
    },

    submitButton: {
      minHeight: 56,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    submitButtonText: {
      fontSize: 17,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    noLevelsText: {
      fontSize: 15,
      color: mutedColor,
      textAlign: "center",
      marginTop: 40,
    },
  });
};
