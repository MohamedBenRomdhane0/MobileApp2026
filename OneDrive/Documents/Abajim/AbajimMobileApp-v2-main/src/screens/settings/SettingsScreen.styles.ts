import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createSettingsStyles = (
  colors: AppColors,
  isDark: boolean
) => {
  const cardBg = isDark ? colors.card : "#F7F9FD";
  const sectionBg = isDark ? colors.card : "#FFFFFF";
  const borderColor = isDark ? "rgba(148,163,184,0.18)" : "#E6EBF3";
  const mainText = isDark ? colors.text : "#1D3557";
  const secondaryText = isDark ? colors.muted : "#7E8AA4";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.bg : "#F4F7FB",
    },

    scrollContent: {
      flexGrow: 1,
    },

    coverContainer: {
      width: "100%",
      minHeight: 210,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: "hidden",
      paddingHorizontal: 20,
      paddingBottom: 18,
      position: "relative",
      justifyContent: "flex-start",
    },

    coverBubbleLeft: {
      position: "absolute",
      top: -22,
      left: -34,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.10)",
    },

    coverBubbleRight: {
      position: "absolute",
      bottom: -28,
      right: -28,
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: "rgba(255,255,255,0.08)",
    },

    headerText: {
      marginTop: 8,
      textAlign: "center",
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    profileCard: {
      marginTop: 18,
      backgroundColor: "rgba(17,39,72,0.72)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      borderRadius: 22,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },

    profileInfo: {
      flex: 1,
      alignItems: "flex-end",
      marginLeft: 12,
    },

    profileName: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
      textAlign: "right",
      maxWidth: "100%",
    },

    roleRow: {
      marginTop: 5,
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    profileRoleText: {
      color: "rgba(255,255,255,0.70)",
      fontSize: 12,
      fontWeight: "500",
      textAlign: "right",
      marginRight: 6,
    },

    onlineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#28C7D1",
      marginLeft: 6,
    },

    avatarOuter: {
      width: 64,
      height: 64,
      borderRadius: 32,
      overflow: "hidden",
      backgroundColor: "#1B3D68",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 32,
    },

    avatarFallback: {
      width: "100%",
      height: "100%",
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarInitials: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "800",
    },

    contentArea: {
      paddingHorizontal: 20,
      paddingTop: 14,
    },

    childSwitcherSection: {
      backgroundColor: sectionBg,
      borderRadius: 22,
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor,
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.12 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },

    childSwitcherTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: mainText,
      textAlign: "center",
      marginBottom: 14,
    },

    optionsWrapper: {
      marginTop: 16,
    },

    optionCard: {
      minHeight: 74,
      backgroundColor: cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.10 : 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },

    optionRightBlock: {
      flex: 1,
      flexDirection: "row-reverse",
      alignItems: "center",
      marginLeft: 12,
    },

    optionIconBubble: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    optionTextWrapper: {
      flex: 1,
      alignItems: "flex-end",
      marginHorizontal: 10,
    },

    optionText: {
      fontSize: 17,
      fontWeight: "800",
      color: mainText,
      textAlign: "right",
    },

    optionSubText: {
      marginTop: 3,
      fontSize: 13,
      color: secondaryText,
      textAlign: "right",
    },

    logoutButton: {
      marginTop: 6,
      minHeight: 58,
      borderRadius: 18,
      borderWidth: 1.4,
      borderColor: "rgba(225,84,84,0.28)",
      backgroundColor: isDark ? "rgba(225,84,84,0.08)" : "#FFF7F7",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row-reverse",
    },

    logoutIcon: {
      marginHorizontal: 8,
    },

    logoutText: {
      color: "#E15454",
      fontSize: 16,
      fontWeight: "800",
    },
  });
};