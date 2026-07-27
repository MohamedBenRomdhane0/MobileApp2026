import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createAddKidsStyles = (
  colors: AppColors,
  isDark: boolean
) => {
  const screenBg = isDark ? colors.bg : "#F5F7FC";
  const formCardBg = isDark ? colors.card : "#F8FAFD";
  const inputBg = isDark ? colors.bg : "#FFFFFF";
  const inputBorder = isDark ? "rgba(148,163,184,0.18)" : "#E2E8F0";
  const titleColor = isDark ? "#FFFFFF" : "#1F3B64";
  const contentTitleColor = isDark ? colors.text : "#1F3B64";
  const mutedColor = isDark ? colors.muted : "#7C8799";
  const genderBg = isDark ? colors.card : "#ECEFF5";
  const genderBorder = isDark ? "rgba(148,163,184,0.18)" : "#D8DEE8";
  const levelBg = isDark ? colors.card : "#ECEFF5";
  const levelBorder = isDark ? "rgba(148,163,184,0.18)" : "#D6DDE8";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: screenBg,
    },

    keyboardContainer: {
      flex: 1,
    },

    scrollContainer: {
      flexGrow: 1,
    },

    heroArea: {
      minHeight: 360,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      overflow: "hidden",
      position: "relative",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 28,
    },

    heroDiagonal: {
      position: "absolute",
      top: -70,
      left: -110,
      width: 260,
      height: 130,
      backgroundColor: isDark
        ? "rgba(43,197,211,0.16)"
        : "#18BFD0",
      transform: [{ rotate: "-24deg" }],
      opacity: 0.96,
    },

    heroCircleTopRight: {
      position: "absolute",
      top: -20,
      right: -35,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.26)",
    },

    heroCircleLeft: {
      position: "absolute",
      left: -80,
      top: 120,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.20)",
    },

    heroCurveBottomRight: {
      position: "absolute",
      right: -170,
      bottom: -190,
      width: 390,
      height: 390,
      borderRadius: 195,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.18)",
    },

    backButton: {
      position: "absolute",
      left: 18,
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(255,255,255,0.42)",
      zIndex: 4,
    },

    createHeroContent: {
      width: "100%",
      alignItems: "center",
      marginTop: 78,
    },

    editHeroContent: {
      width: "100%",
      alignItems: "center",
      marginTop: 68,
    },

    heroIllustrationCard: {
      width: 220,
      height: 150,
      borderRadius: 30,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(255,255,255,0.72)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(255,255,255,0.7)",
      shadowColor: "#1A365D",
      shadowOpacity: isDark ? 0.14 : 0.10,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    logoHero: {
      width: 190,
      height: 125,
    },

    avatarPress: {
      width: 152,
      height: 152,
      borderRadius: 76,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarOuterRing: {
      width: 152,
      height: 152,
      borderRadius: 76,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.55)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: isDark
        ? "rgba(255,255,255,0.12)"
        : "rgba(255,255,255,0.9)",
    },

    avatar: {
      width: 142,
      height: 142,
      borderRadius: 71,
      borderWidth: 4,
      borderColor: "#FFFFFF",
      backgroundColor: "#E5E7EB",
    },

    avatarFallback: {
      width: 142,
      height: 142,
      borderRadius: 71,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: inputBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    cameraBadge: {
      position: "absolute",
      bottom: 14,
      right: 16,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: isDark ? "#284B7D" : "#203F6C",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2.5,
      borderColor: "#FFFFFF",
      shadowColor: "#203F6C",
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    avatarChangeText: {
      marginTop: 10,
      fontSize: 17,
      fontWeight: "900",
      color: titleColor,
      textAlign: "center",
    },

    avatarHintText: {
      marginTop: 4,
      fontSize: 14,
      color: isDark ? "rgba(255,255,255,0.70)" : mutedColor,
      textAlign: "center",
    },

    heroTitle: {
      marginTop: 14,
      fontSize: 24,
      fontWeight: "900",
      color: titleColor,
      textAlign: "center",
      paddingHorizontal: 24,
    },

    formCard: {
      marginTop: -22,
      marginHorizontal: 16,
      borderRadius: 30,
      backgroundColor: formCardBg,
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 20,
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.14 : 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? "rgba(148,163,184,0.16)" : "transparent",
    },

    errorBanner: {
      backgroundColor: "rgba(220,38,38,0.08)",
      borderWidth: 1,
      borderColor: "rgba(220,38,38,0.16)",
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

    fieldBlock: {
      marginBottom: 18,
    },

    label: {
      fontSize: 17,
      fontWeight: "900",
      color: contentTitleColor,
      textAlign: "right",
      marginBottom: 10,
    },

    input: {
      minHeight: 72,
      borderRadius: 18,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: inputBorder,
      paddingHorizontal: 18,
      fontSize: 18,
      color: isDark ? colors.text : "#111827",
      textAlign: "right",
    },

    fieldError: {
      marginTop: 8,
      fontSize: 13,
      color: "#DC2626",
      fontWeight: "700",
      textAlign: "right",
    },

    genderRow: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },

    genderTouch: {
      width: "48.5%",
    },

    genderButton: {
      minHeight: 92,
      borderRadius: 22,
      backgroundColor: genderBg,
      borderWidth: 1,
      borderColor: genderBorder,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
    },

    genderButtonSelected: {
      minHeight: 92,
      borderRadius: 22,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
    },

    genderIcon: {
      width: 42,
      height: 42,
      marginLeft: 10,
    },

    genderText: {
      fontSize: 17,
      fontWeight: "900",
      color: contentTitleColor,
    },

    genderTextSelected: {
      fontSize: 17,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    levelRow: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    levelButton: {
      width: "31.5%",
      aspectRatio: 1,
      borderRadius: 26,
      backgroundColor: levelBg,
      borderWidth: 1.5,
      borderColor: levelBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    levelButtonSelected: {
      backgroundColor: isDark ? "#179DAB" : "#0FA6B6",
      borderColor: isDark ? "#179DAB" : "#0FA6B6",
      shadowColor: "#0FA6B6",
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },

    levelIcon: {
      width: 60,
      height: 60,
    },

    levelIconSelected: {
      transform: [{ scale: 1.08 }],
    },

    levelLockedHint: {
      marginTop: -4,
      marginBottom: 16,
      fontSize: 14,
      color: mutedColor,
      fontWeight: "700",
      textAlign: "right",
    },

    submitTouch: {
      marginTop: 6,
      borderRadius: 22,
      overflow: "hidden",
      shadowColor: "#1F3B64",
      shadowOpacity: 0.16,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },

    submitButton: {
      minHeight: 62,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },

    submitButtonText: {
      fontSize: 20,
      color: "#FFFFFF",
      fontWeight: "900",
    },
  });
};