import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createChildSwitcherStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
      width: "100%",
    },

    listContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },

    childWrapper: {
      alignItems: "center",
      marginHorizontal: 5,
      maxWidth: 64,
    },

    childProfileWrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      width: 64,
      height: 64,
      borderRadius: 32,
    },

    childProfile: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.card,
    },

    childName: {
      fontSize: 11,
      color: colors.header,
      textAlign: "center",
      marginTop: 4,
    },

    activeDot: {
      position: "absolute",
      bottom: 0,
      left: 38,
      width: 12,
      height: 12,
      backgroundColor: "#22C55E",
      borderRadius: 6,
      borderWidth: 2,
      borderColor: "#FFF",
    },

    activeChildBorder: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 33,
      padding: 2,
      backgroundColor: "#FFF",
    },

    initialsText: {
      fontSize: 10,
      color: "#fff",
      fontWeight: "700",
    },

    disabled: {
      opacity: 0.6,
    },
  });