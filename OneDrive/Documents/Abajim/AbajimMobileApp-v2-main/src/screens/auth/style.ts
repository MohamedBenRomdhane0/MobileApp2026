import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { AppColors } from "@theme/types";

type LegacyStyles = StyleSheet.NamedStyles<{
  background: ViewStyle;
  scrollContainer: ViewStyle;

  logoHero: ImageStyle;
  heroTitle: TextStyle;
  titleCenter: TextStyle;

  labelRtl: TextStyle;
  input: ViewStyle;

  buttonPrimary: ViewStyle;
  buttonText: TextStyle;

  forgotPassword: TextStyle;
  errorText: TextStyle;
  orText: TextStyle;
  registerLink: TextStyle;
  loginLink: TextStyle;

  socialButtons: ViewStyle;
  socialButton: ViewStyle;
}>;

export const createAuthStyles = (colors: AppColors, isDark: boolean) => {
  const screenBg = isDark ? colors.bg : "#F4F7FB";
  const cardBg = isDark ? colors.card : "#F8FAFD";
  const cardBorder = isDark ? "rgba(148,163,184,0.18)" : "#E2E8F0";
  const titleColor = isDark ? "#FFFFFF" : "#1F3B64";
  const contentTitleColor = isDark ? colors.text : "#1F3B64";
  const mutedColor = isDark ? colors.muted : "#7C8799";
  const inputBg = isDark ? colors.bg : "#FFFFFF";
  const inputBorder = isDark ? "rgba(148,163,184,0.18)" : "#E2E8F0";
  const socialBg = isDark ? colors.card : "#EEF2F7";
  const socialBorder = isDark ? "rgba(148,163,184,0.18)" : "#E2E8F0";

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

    heroSection: {
      minHeight: 320,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      overflow: "hidden",
      paddingHorizontal: 20,
      paddingBottom: 28,
      position: "relative",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    heroBubbleLeft: {
      position: "absolute",
      top: -28,
      left: -36,
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: "rgba(255,255,255,0.10)",
    },

    heroBubbleRight: {
      position: "absolute",
      top: -10,
      right: -26,
      width: 118,
      height: 118,
      borderRadius: 59,
      backgroundColor: "rgba(255,255,255,0.08)",
    },

    heroBubbleBottom: {
      position: "absolute",
      left: -70,
      bottom: -90,
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.16)",
    },

    heroContent: {
      width: "100%",
      alignItems: "center",
      marginTop: 36,
    },

    logoHero: {
      width: 200,
      height: 78,
      marginBottom: 24,
    },

    heroTitle: {
      fontSize: 26,
      color: titleColor,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: 8,
    },

    heroSubtitle: {
      fontSize: 16,
      color: isDark ? "rgba(255,255,255,0.72)" : "#6D7B90",
      fontWeight: "600",
      textAlign: "center",
      paddingHorizontal: 24,
    },

    formCard: {
      marginTop: -28,
      marginHorizontal: 16,
      borderRadius: 28,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: cardBorder,
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 20,
      shadowColor: "#0F172A",
      shadowOpacity: isDark ? 0.14 : 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },

    formFieldsWrap: {
      width: "100%",
    },

    titleCenter: {
      fontSize: 21,
      color: contentTitleColor,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
    },

    labelRtl: {
      alignSelf: "flex-end",
      fontSize: 15,
      fontWeight: "bold",
      color: contentTitleColor,
      marginBottom: 6,
    },

    input: {
      width: "100%",
      minHeight: 58,
      borderWidth: 1,
      borderColor: inputBorder,
      borderRadius: 18,
      paddingHorizontal: 15,
      marginBottom: 12,
      backgroundColor: inputBg,
    },

    forgotPassword: {
      color: colors.primary,
      fontSize: 14,
      alignSelf: "flex-end",
      marginTop: 4,
      marginBottom: 14,
      fontWeight: "700",
      textAlign: "right",
    },

    buttonPrimaryTouch: {
      borderRadius: 18,
      overflow: "hidden",
      marginTop: 2,
      marginBottom: 18,
      shadowColor: colors.primary,
      shadowOpacity: 0.20,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    buttonPrimary: {
      minHeight: 58,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 18,
    },

    buttonPrimarySolid: {
      minHeight: 58,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 18,
      backgroundColor: colors.primary,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    errorText: {
      color: "#DC2626",
      fontSize: 14,
      marginBottom: 10,
      textAlign: "right",
      fontWeight: "700",
    },

    orText: {
      fontSize: 15,
      color: mutedColor,
      marginBottom: 12,
      textAlign: "center",
      fontWeight: "600",
    },

    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 14,
      marginBottom: 18,
    },

    socialButton: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: socialBg,
      borderWidth: 1,
      borderColor: socialBorder,
    },

    registerLink: {
      textAlign: "center",
      color: contentTitleColor,
      fontSize: 15,
      fontWeight: "700",
    },

    registerLinkAccent: {
      color: colors.primary,
      fontWeight: "900",
    },

    loginLink: {
      textAlign: "center",
      color: contentTitleColor,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};

const legacyStyles = StyleSheet.create<LegacyStyles>({
  background: { flex: 1, width: "100%", height: "100%" },
  scrollContainer: {
    paddingTop: 120,
    paddingBottom: 40,
    alignItems: "center",
    width: "100%",
  },

  logoHero: { width: 200, height: 70, marginBottom: 40 },
  heroTitle: {
    fontSize: 22,
    color: "#1F3B64",
    fontWeight: "bold",
    marginBottom: 12,
  },
  titleCenter: {
    fontSize: 21,
    color: "#1F3B64",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  labelRtl: {
    alignSelf: "flex-end",
    marginRight: "5%",
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F3B64",
    marginBottom: 6,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  buttonPrimary: {
    width: "90%",
    height: 50,
    backgroundColor: "#17A2B8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 8,
    marginBottom: 18,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  forgotPassword: {
    color: "#17A2B8",
    fontSize: 14,
    alignSelf: "flex-end",
    marginRight: "7%",
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "right",
  },
  orText: { fontSize: 16, color: "#777", marginBottom: 10 },
  registerLink: {
    textAlign: "center",
    color: "#1F3B64",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    textAlign: "center",
    color: "#1F3B64",
    fontSize: 16,
    fontWeight: "bold",
  },

  socialButtons: { flexDirection: "row", gap: 15, marginBottom: 18 },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default legacyStyles;