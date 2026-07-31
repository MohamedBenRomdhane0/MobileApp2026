import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createParentInfoStyles = (
  colors: AppColors,
  isDark: boolean,
  isRTL: boolean
) => {
  const screenBg = isDark ? colors.bg : "#F5F7FB";
  const cardBg = isDark ? colors.card : "#EEF2F8";
  const borderColor = isDark ? "rgba(148,163,184,0.18)" : "#E4E9F2";
  const muted = isDark ? colors.muted : "#7B869C";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: screenBg,
    },

    content: {
      paddingBottom: 24,
    },

    header: {
      minHeight: 170,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      paddingHorizontal: 18,
      paddingBottom: 34,
      overflow: "hidden",
      position: "relative",
      justifyContent: "flex-start",
    },

    headerBubbleLeft: {
      position: "absolute",
      top: -24,
      left: -34,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.11)",
    },

    headerBubbleRight: {
      position: "absolute",
      bottom: -34,
      right: -28,
      width: 132,
      height: 132,
      borderRadius: 66,
      backgroundColor: "rgba(255,255,255,0.08)",
    },

    headerTopRow: {
      minHeight: 48,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 2,
    },

    backBtn: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.14)",
      zIndex: 5,
    },

    headerTitleWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 56,
    },

    headerTitle: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 20,
      textAlign: "center",
      letterSpacing: 0.2,
    },

    headerSideSpacer: {
      width: 42,
      height: 42,
    },

    mainCard: {
      marginTop: -16,
      marginHorizontal: 16,
      borderRadius: 30,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor,
      paddingHorizontal: 16,
      paddingTop: 22,
      paddingBottom: 20,
      overflow: "hidden",
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.16 : 0.07,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },

    cardGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 120,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },

    avatarSection: {
      alignItems: "center",
      paddingTop: 6,
      paddingBottom: 12,
    },

    avatarPress: {
      width: 162,
      height: 162,
      borderRadius: 81,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },

    avatarRing: {
      width: 162,
      height: 162,
      borderRadius: 81,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.35)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.65)",
    },

    avatar: {
      width: 154,
      height: 154,
      borderRadius: 77,
      backgroundColor: "#FFFFFF",
    },

    avatarFallback: {
      width: 154,
      height: 154,
      borderRadius: 77,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor,
    },

    cameraBadge: {
      position: "absolute",
      bottom: 14,
      right: 18,
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderWidth: 2.5,
      borderColor: "#FFFFFF",
      shadowColor: colors.primary,
      shadowOpacity: 0.28,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    avatarChangeText: {
      textAlign: "center",
      fontWeight: "800",
      fontSize: 17,
      color: isDark ? colors.text : "#111827",
      marginTop: 2,
    },

    avatarHintText: {
      textAlign: "center",
      color: muted,
      fontSize: 14,
      marginTop: 4,
    },

    form: {
      marginTop: 8,
    },

    fieldBlock: {
      marginBottom: 6,
    },

    primaryBtn: {
      marginTop: 10,
      borderRadius: 999,
      overflow: "hidden",
      shadowColor: colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },

    primaryBtnGradient: {
      minHeight: 60,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 18,
      letterSpacing: 0.2,
    },

    secondaryBtn: {
      marginTop: 14,
      minHeight: 58,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: "transparent",
    },

    secondaryText: {
      color: colors.primary,
      fontWeight: "800",
      fontSize: 17,
    },

    disabled: {
      opacity: 0.65,
    },
  });
};