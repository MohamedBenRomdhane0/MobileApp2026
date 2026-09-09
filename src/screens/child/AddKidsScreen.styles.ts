import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createAddKidsStyles = (
  colors: AppColors,
  isDark: boolean,
  isRTL: boolean
) => {
  const screenBg = isDark ? "#061428" : "#e0f3f3";
  const cardBg = isDark ? colors.card : "hsl(0, 0%, 100%)";
  const cardBorder = isDark ? "rgba(148,163,184,0.16)" : "#E9EEF5";
  const surface = isDark ? "rgba(148,163,184,0.10)" : "#EFF3F8";
  const surface2 = isDark ? "rgba(148,163,184,0.16)" : "#E6ECF3";
  const titleColor = isDark ? "#FFFFFF" : "#1A2F4D";
  const contentTitleColor = isDark ? colors.text : "#1F3B64";
  const mutedColor = isDark ? colors.muted : "#64748B";
  const primaryColor = isDark ? "#21D1CA" : "#00B7B0";
  const inputBg = isDark ? "rgba(23,42,74,0.7)" : "#F3F7FB";
  const inputBorder = isDark ? "rgba(170, 184, 203, 0.18)" : "#E2E8F0";
  const textEnd = isRTL ? ("right" as const) : ("left" as const);
  const writingDir = isRTL ? ("rtl" as const) : ("ltr" as const);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: screenBg,
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

    topNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    topNavStart: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.9)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(148,163,184,0.18)" : "#E6ECF3",
      shadowColor: "#1A365D",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },

    headerBlock: {
      marginBottom: 16,
    },

    logoText: {
      fontSize: 26,
      fontWeight: "900",
      letterSpacing: -0.6,
      color: titleColor,
    },

    logoAccent: {
      color: primaryColor,
    },

    noSignupPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: isDark
        ? "rgba(33,209,202,0.12)"
        : "rgba(0,183,176,0.12)",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },

    noSignupDot: {
      width: 6,
      height: 6,
      borderRadius: 9999,
      backgroundColor: primaryColor,
    },

    noSignupText: {
      fontSize: 12,
      fontWeight: "800",
      color: primaryColor,
    },

    topNavEnd: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#19273B" : "#F1F6FA",
      borderWidth: 1,
      borderColor: isDark ? "rgba(50,62,80,0.7)" : "rgba(216,223,230,0.7)",
    },

    themeToggleIcon: {
      color: isDark ? "#9AA6B4" : "#667383",
    },

    badgePill: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: isDark ? "rgba(148,163,184,0.12)" : "#EAF4F6",
      borderWidth: 1,
      borderColor: isDark ? "rgba(148,163,184,0.20)" : "#D3E8EC",
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },

    badgeText: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: primaryColor,
    },

    heroTitle: {
      marginTop: 10,
      fontSize: 28,
      lineHeight: 32,
      fontWeight: "900",
      color: titleColor,
    },

    heroSubtitle: {
      marginTop: 6,
      fontSize: 15,
      lineHeight: 20,
      color: mutedColor,
    },

    formCard: {
      borderRadius: 28,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: cardBorder,
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 14,
      shadowColor: "#1A365D",
      shadowOpacity: isDark ? 0.5 : 0.12,
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

    label: {
      marginTop: 16,
      fontSize: 15,
      fontWeight: "700",
      color: mutedColor,
    },

    input: {
      marginTop: 6,
      minHeight: 52,
      borderRadius: 18,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: inputBorder,
      paddingHorizontal: 16,
      fontSize: 16,
      color: isDark ? colors.text : "#111827",
      textAlign: textEnd,
      writingDirection: writingDir,
    },

    fieldError: {
      marginTop: 6,
      fontSize: 13,
      color: "#DC2626",
      fontWeight: "700",
      textAlign: textEnd,
    },

    genderRow: {
      flexDirection: "row-reverse",
      marginTop: 8,
      gap: 12,
    },

    genderTouch: {
      flex: 1,
    },

    genderButton: {
      minHeight: 60,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: surface2,
      backgroundColor: surface,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingHorizontal: 12,
    },

    genderButtonSelected: {
      borderColor: primaryColor,
      backgroundColor: isDark
        ? "rgba(23,157,171,0.22)"
        : "rgba(15,166,182,0.12)",
      shadowColor: primaryColor,
      shadowOpacity: isDark ? 0.3 : 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    genderEmoji: {
      fontSize: 24,
    },

    genderText: {
      fontSize: 16,
      fontWeight: "800",
      color: contentTitleColor,
    },

    genderTextSelected: {
      color: contentTitleColor,
    },

    genderCheckBadge: {
      position: "absolute",
      top: 8,
      start: 8,
      width: 22,
      height: 22,
      borderRadius: 9999,
      backgroundColor: primaryColor,
      alignItems: "center",
      justifyContent: "center",
    },

    levelSection: {
      marginTop: 14,
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
      textAlign: "right",
    },

    levelLockedHint: {
      marginTop: 14,
      marginBottom: 4,
      fontSize: 14,
      color: mutedColor,
      fontWeight: "700",
      textAlign: "right",
    },

    errorBanner: {
      backgroundColor: "rgba(220,38,38,0.08)",
      borderWidth: 1,
      borderColor: "rgba(220,38,38,0.18)",
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 14,
    },

    errorBannerText: {
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "700",
      textAlign: "right",
    },

    editBlock: {
      alignItems: "center",
      marginBottom: 12,
    },

    avatarPress: {
      width: 120,
      height: 120,
      borderRadius: 9999,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarOuterRing: {
      width: 120,
      height: 120,
      borderRadius: 9999,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(255,255,255,0.7)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: isDark ? "rgba(255,255,255,0.14)" : "#E3EDF2",
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: 9999,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      backgroundColor: "#E5E7EB",
    },

    avatarFallback: {
      width: 110,
      height: 110,
      borderRadius: 9999,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: inputBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    cameraBadge: {
      position: "absolute",
      bottom: 10,
      end: 12,
      width: 36,
      height: 36,
      borderRadius: 9999,
      backgroundColor: primaryColor,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2.5,
      borderColor: cardBg,
      shadowColor: "#203F6C",
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    avatarChangeText: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: "800",
      color: titleColor,
    },

    avatarHintText: {
      marginTop: 2,
      fontSize: 13,
      color: mutedColor,
    },

    submitTouch: {
      marginTop: 14,
      borderRadius: 24,
      overflow: "hidden",
      shadowColor: primaryColor,
      shadowOpacity: isDark ? 0.32 : 0.26,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },

    submitButton: {
      minHeight: 58,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },

    submitButtonText: {
      fontSize: 18,
      color: "#FFFFFF",
      fontWeight: "800",
    },
  });
};
