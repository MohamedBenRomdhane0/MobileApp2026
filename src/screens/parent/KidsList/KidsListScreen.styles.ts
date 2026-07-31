import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createKidsListStyles = (
  colors: AppColors,
  isDark: boolean
) => {
  const screenBg = isDark ? colors.bg : "#F5F7FB";
  const cardBg = isDark ? colors.card : "#EEF2F7";
  const cardBorder = isDark ? "rgba(148,163,184,0.18)" : "#E4E8F0";
  const avatarBg = isDark ? "rgba(59,130,246,0.10)" : "#E3ECF6";
  const titleColor = isDark ? colors.text : "#0F172A";
  const mutedColor = isDark ? colors.muted : "#7E8798";
  const pillBg = isDark ? "rgba(59,130,246,0.14)" : "#E7EDF8";
  const addBtnBg = isDark ? colors.card : "#EDF1F6";
  const addBtnBorder = isDark ? "rgba(148,163,184,0.18)" : "#DDE3EC";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: screenBg,
    },

    header: {
      height: 132,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },

    headerBubbleLeft: {
      position: "absolute",
      top: -22,
      left: -28,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.10)",
    },

    headerBubbleRight: {
      position: "absolute",
      bottom: -32,
      right: -30,
      width: 132,
      height: 132,
      borderRadius: 66,
      backgroundColor: "rgba(255,255,255,0.08)",
    },

    backBtn: {
      position: "absolute",
      left: 18,
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.10)",
      zIndex: 5,
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
      marginTop: 10,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 18,
    },

    separator: {
      height: 14,
    },

    card: {
      minHeight: 106,
      borderRadius: 24,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.10 : 0.03,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    },

    cardMain: {
      flex: 1,
      flexDirection: "row-reverse",
      alignItems: "center",
      marginLeft: 14,
    },

    avatarWrap: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      marginLeft: 14,
      backgroundColor: avatarBg,
    },

    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
    },

    initialsAvatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    initialsText: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "800",
    },

    info: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    name: {
      fontSize: 17,
      fontWeight: "800",
      color: titleColor,
      textAlign: "right",
      marginBottom: 8,
    },

    levelPill: {
      flexDirection: "row-reverse",
      alignItems: "center",
      backgroundColor: pillBg,
      borderRadius: 999,
      paddingVertical: 7,
      paddingHorizontal: 12,
      alignSelf: "flex-end",
      maxWidth: "100%",
    },

    levelIcon: {
      marginLeft: 6,
    },

    levelText: {
      fontSize: 13,
      color: titleColor,
      fontWeight: "600",
      textAlign: "right",
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 4,
      gap: 10,
    },

    actionBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },

    editBtn: {
      backgroundColor: isDark
        ? "rgba(38,198,218,0.16)"
        : "rgba(38,198,218,0.12)",
      borderWidth: 1.2,
      borderColor: isDark
        ? "rgba(38,198,218,0.34)"
        : "rgba(38,198,218,0.30)",
    },

    deleteBtn: {
      backgroundColor: isDark
        ? "rgba(244,91,105,0.16)"
        : "rgba(244,91,105,0.10)",
      borderWidth: 1.2,
      borderColor: isDark
        ? "rgba(244,91,105,0.34)"
        : "rgba(244,91,105,0.26)",
    },

    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40,
      paddingHorizontal: 24,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: titleColor,
      textAlign: "center",
    },

    emptyHint: {
      marginTop: 8,
      fontSize: 13,
      color: mutedColor,
      textAlign: "center",
      lineHeight: 20,
    },

    footer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 26,
      paddingBottom: 8,
    },

    addBtn: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: addBtnBg,
      borderWidth: 1.5,
      borderColor: addBtnBorder,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.10 : 0.03,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
    },

    addBtnDisabled: {
      opacity: 0.95,
    },

    counter: {
      marginTop: 14,
      fontSize: 18,
      fontWeight: "800",
      color: mutedColor,
      textAlign: "center",
    },
  });
};