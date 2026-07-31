import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types"; 
type ThemeParts = {
  colors: AppColors;
  typography: any;
  components: any;
};

export const createParentProfileCardStyles = ({
  colors,
}: ThemeParts) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
      alignItems: "center",
      marginTop: -40,
      marginBottom: 10,
    },

    card: {
      width: "90%",
      borderRadius: 22,
      paddingVertical: 14,
      paddingHorizontal: 16,
      position: "relative",
      borderWidth: 1,

      shadowColor: colors.text,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },

    decorCircle: {
      position: "absolute",
      left: -10,
      bottom: -10,
      width: 80,
      height: 80,
      borderRadius: 40,
    },

    row: {
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    avatarWrapper: {
      marginLeft: 14,
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 3,
    },

    initialsCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,

      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },

    initialsText: {
      fontWeight: "800",
    },

    textBlock: {
      flex: 1,
      alignItems: "flex-end",
    },

    name: {
      fontWeight: "800",
    },

    badgeRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      marginTop: 6,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 6,
    },

    badgeText: {
      fontWeight: "600",
    },
  });