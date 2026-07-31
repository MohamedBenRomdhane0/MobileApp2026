import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type Args = { open: boolean; isRTL: boolean };

const shadowCard: ViewStyle = {
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 12 },
  elevation: 12,
};

export function createLanguageSwitcherStyles({ open, isRTL }: Args) {
  return StyleSheet.create({
    chip: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      height: 36,
      borderRadius: 18,
    },
    chipText: {
      fontSize: 12.5,
      fontWeight: "800",
      letterSpacing: 0.4,
      minWidth: 18,
      textAlign: "center",
    },

    // ── Dropdown sheet ───────────────────────────────────────────────────
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15,23,42,0.45)",
      justifyContent: "flex-end",
    },
    sheetWrap: {
      width: "100%",
    },
    sheet: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 28,
      ...shadowCard,
    },
    handle: {
      alignSelf: "center",
      width: 44,
      height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(148,163,184,0.45)",
      marginBottom: 12,
    },
    sheetHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingHorizontal: 2,
    },
    sheetTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#0F172A",
    } as TextStyle,
    sheetClose: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#F1F5F9",
      alignItems: "center",
      justifyContent: "center",
    },
    row: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginTop: 4,
    } as ViewStyle,
    rowActive: {
      backgroundColor: "rgba(34,190,200,0.10)",
    },
    rowLeft: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
    },
    rowFlag: {
      fontSize: 24,
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: "800",
      color: "#0F172A",
    } as TextStyle,
    rowNative: {
      fontSize: 12,
      color: "#64748B",
      marginTop: 2,
    } as TextStyle,
  });
}
