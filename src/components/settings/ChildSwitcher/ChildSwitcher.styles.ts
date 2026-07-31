import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export const createChildSwitcherStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      width: "100%",
    },

    listContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 8,
    },

    childWrapper: {
      alignItems: "center",
      marginHorizontal: 6,
      maxWidth: 70,
    },

    childProfileWrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      width: 65,
      height: 65,
      borderRadius: 33,
    },

    childProfile: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor: colors.card,
    },

    childName: {
      fontSize: 12,
      color: colors.header,
      textAlign: "center",
      marginTop: 5,
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