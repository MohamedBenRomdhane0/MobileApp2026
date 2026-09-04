import { StyleSheet } from "react-native";

import type { AppColors } from "@theme/types";

export const createCheckoutStyles = (
  colors: AppColors,
  isDark: boolean,
  isRTL: boolean,
) => {
  const row = (isRTL ? "row-reverse" : "row") as "row" | "row-reverse";
  const textEnd = (isRTL ? "right" : "left") as "right" | "left";
  const dir = (isRTL ? "rtl" : "ltr") as "rtl" | "ltr";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    headerWrap: {
      marginHorizontal: -18,
      marginTop: -18,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },

    header: {
      paddingHorizontal: 20,
      paddingBottom: 18,
      paddingTop: 8,
      flexDirection: row,
      alignItems: "center",
      gap: 12,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "800",
      flex: 1,
      textAlign: textEnd,
      writingDirection: dir,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 24,
    },

    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
      overflow: "hidden",
    },
    summaryAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: colors.primary,
    },
    summaryLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    summaryOfferRow: {
      flexDirection: row,
      alignItems: "center",
      marginBottom: 12,
    },
    summaryIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: `${colors.primary}18`,
      alignItems: "center",
      justifyContent: "center",
      marginEnd: 12,
    },
    summaryPlanName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
      flex: 1,
      textAlign: textEnd,
      writingDirection: dir,
    },
    summaryDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    summaryRow: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    summaryRowLabel: {
      color: colors.muted,
      fontSize: 14,
    },
    summaryRowValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    summaryPriceRow: {
      flexDirection: row,
      justifyContent: "space-between",
      alignItems: "baseline",
      backgroundColor: `${colors.primary}0D`,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginTop: 4,
    },
    summaryPriceLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    summaryPrice: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "900",
    },
    summaryPriceCurrency: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "700",
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 12,
    },

    methodsList: {
      gap: 12,
      marginBottom: 18,
    },
    methodCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 14,
      flexDirection: row,
      alignItems: "center",
      gap: 14,
    },
    methodCardActive: {
      borderColor: colors.primary,
    },
    methodIconBox: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: `${colors.primary}14`,
      alignItems: "center",
      justifyContent: "center",
    },
    methodTextWrap: {
      flex: 1,
    },
    methodTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      textAlign: textEnd,
      writingDirection: dir,
    },
    methodDesc: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 16,
      marginTop: 2,
      textAlign: textEnd,
      writingDirection: dir,
    },
    methodCheck: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    methodCheckActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    detailCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 18,
    },

    baqaBadge: {
      flexDirection: row,
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "#8B5CF61A",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 6,
      marginBottom: 12,
    },
    baqaBadgeText: {
      color: "#8B5CF6",
      fontSize: 11.5,
      fontWeight: "700",
    },
    codeLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: textEnd,
      writingDirection: dir,
    },
    codeInputBox: {
      flexDirection: row,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      backgroundColor: colors.bg,
      paddingHorizontal: 14,
      height: 52,
      gap: 10,
    },
    codeInputBoxFocused: {
      borderColor: "#8B5CF6",
    },
    codeInput: {
      flex: 1,
      color: colors.text,
      fontSize: 18,
      letterSpacing: 6,
      fontWeight: "800",
      textAlign: isRTL ? "right" : "left",
    },
    codeDots: {
      flexDirection: row,
      justifyContent: "center",
      gap: 8,
      marginTop: 14,
    },
    codeDot: {
      width: 11,
      height: 11,
      borderRadius: 5.5,
      backgroundColor: colors.border,
    },
    codeDotActive: {
      backgroundColor: "#8B5CF6",
    },

    bankCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#22BEC844",
      backgroundColor: `${colors.primary}0D`,
      padding: 14,
      gap: 8,
      marginBottom: 14,
    },
    bankRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 10,
    },
    bankLabel: {
      color: colors.muted,
      fontSize: 12.5,
      width: 90,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "700",
    },
    bankValue: {
      color: colors.text,
      fontSize: 13.5,
      fontWeight: "700",
      flex: 1,
      textAlign: textEnd,
      writingDirection: dir,
    },
    ribValue: {
      letterSpacing: 1,
      fontVariant: ["tabular-nums"],
    },

    uploadBtn: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 14,
      backgroundColor: "#22BEC816",
      borderWidth: 1.5,
      borderColor: "#22BEC855",
      borderStyle: "dashed",
      paddingVertical: 14,
    },
    uploadBtnText: {
      color: colors.primary,
      fontSize: 13.5,
      fontWeight: "700",
    },
    uploadHint: {
      color: colors.muted,
      fontSize: 11,
      textAlign: "center",
      marginTop: 8,
    },

    confirmBtnWrap: {
      paddingHorizontal: 18,
      paddingBottom: 10,
    },
    confirmBtn: {
      borderRadius: 18,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmBtnInner: {
      width: "100%",
      height: "100%",
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    confirmBtnText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
    },

    successWrap: {
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    successIcon: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: "#22BEC820",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    successTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: 10,
    },
    successDesc: {
      color: colors.muted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
    doneBtn: {
      marginTop: 32,
      borderRadius: 18,
      height: 54,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    doneBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },
  });
};
