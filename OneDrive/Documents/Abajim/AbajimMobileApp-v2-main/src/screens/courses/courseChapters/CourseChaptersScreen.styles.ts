import { Platform, StyleSheet } from "react-native";

const shadowCard = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 10 },
  elevation: 5,
};

const shadowHeader = {
  shadowColor: "#000",
  shadowOpacity: 0.22,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 14 },
  elevation: 10,
};

export function createCourseChaptersStyles(colors: any, isDark: boolean) {
  const bg = colors.bg;
  const card = colors.card;
  const text = colors.text;
  const muted = colors.muted;
  const border = colors.border;
  const header = colors.header;
  const primary = colors.primary;

  const softBorder = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.20)";
  const glass = isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.16)";
  const softFill = isDark ? "rgba(226,232,240,0.10)" : "rgba(15,23,42,0.06)";
  const chipBg = isDark ? "rgba(2,6,23,0.72)" : "rgba(255,255,255,0.92)";

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: bg,
    },

    headerShell: {
      backgroundColor: header,
    },

    headerGradient: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      minHeight: 140,
      overflow: "hidden",
      backgroundColor: header,
      ...shadowHeader,
    },

    headerGlowA: {
      position: "absolute",
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: "rgba(34,190,200,0.18)",
      top: -120,
      left: -110,
    },

    headerGlowB: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -160,
      right: -120,
    },

    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Platform.OS === "android" ? 8 : 6,
    },

    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: glass,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
      textAlign: "center",
      flex: 1,
      paddingHorizontal: 10,
    },

    headerRightSlot: {
      width: 42,
      height: 42,
    },

    listContent: {
      paddingBottom: 26,
    },

    summaryWrap: {
      marginTop: 12,
      paddingHorizontal: 16,
    },

    summaryCard: {
      backgroundColor: card,
      borderRadius: 22,
      padding: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      borderWidth: 1,
      borderColor: softBorder,
      ...shadowCard,
      gap: 12,
    },

    summaryCover: {
      width: 96,
      height: 120,
      borderRadius: 18,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
    },

    summaryRight: {
      flex: 1,
      alignItems: "flex-end",
    },

    summaryTitle: {
      color: text,
      fontSize: 16.5,
      fontWeight: "900",
      textAlign: "right",
    },

    summaryHint: {
      marginTop: 6,
      color: muted,
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "right",
      lineHeight: 18,
    },

    teacherRow: {
      marginTop: 10,
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 8,
    },

    teacherAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
      borderWidth: 2,
      borderColor: primary,
    },

    teacherFallback: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: primary,
      alignItems: "center",
      justifyContent: "center",
    },

    teacherFallbackText: {
      color: "#FFF",
      fontSize: 12.5,
      fontWeight: "900",
    },

    teacherInfo: {
      alignItems: "flex-end",
      flexShrink: 1,
    },

    teacherLabel: {
      color: muted,
      fontSize: 11.5,
      fontWeight: "900",
      textAlign: "right",
    },

    teacherName: {
      color: text,
      fontSize: 13.5,
      fontWeight: "900",
      textAlign: "right",
      maxWidth: 210,
    },

    tabsWrap: {
      marginTop: 14,
      paddingHorizontal: 16,
    },

    tabsContainer: {
      flexDirection: "row-reverse",
      backgroundColor: softFill,
      borderRadius: 999,
      padding: 4,
      gap: 6,
      borderWidth: 1,
      borderColor: softBorder,
    },

    tabBtn: {
      flex: 1,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      paddingVertical: 9,
      gap: 7,
      backgroundColor: "transparent",
    },

    tabBtnActive: {
      backgroundColor: primary,
    },

    tabText: {
      fontSize: 12.5,
      fontWeight: "900",
      color: primary,
      textAlign: "right",
    },

    tabTextActive: {
      color: "#FFFFFF",
    },

    sectionHeaderRow: {
      marginTop: 16,
      paddingHorizontal: 16,
      alignItems: "flex-end",
    },

    sectionTitle: {
      color: text,
      fontSize: 16.5,
      fontWeight: "900",
      textAlign: "right",
    },

    chapterCard: {
      marginTop: 12,
      marginHorizontal: 16,
      borderRadius: 20,
      backgroundColor: card,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
    },

    chapterHeader: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 10,
    },

    chapterIndexCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(34,190,200,0.12)" : "rgba(34,190,200,0.14)",
      borderWidth: 1,
      borderColor: softBorder,
    },

    chapterIndexText: {
      color: isDark ? "#E2E8F0" : "#1F3B64",
      fontSize: 16,
      fontWeight: "900",
    },

    chapterTitleWrap: {
      flex: 1,
      alignItems: "flex-end",
    },

    chapterTitle: {
      color: text,
      fontSize: 14.5,
      fontWeight: "900",
      textAlign: "right",
    },

    chevronCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chipBg,
      borderWidth: 1,
      borderColor: primary,
    },

    chevronCircleOpen: {
      backgroundColor: primary,
      borderColor: primary,
    },

    chapterBody: {
      borderTopWidth: 1,
      borderTopColor: border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: isDark ? "rgba(2,6,23,0.55)" : "rgba(248,250,252,0.9)",
    },

    chapterDesc: {
      color: text,
      fontSize: 12.8,
      fontWeight: "700",
      textAlign: "right",
      lineHeight: 19,
    },

    chapterNoDesc: {
      color: muted,
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "center",
      marginTop: 8,
    },

    videoWrap: {
      marginTop: 12,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: isDark ? "#020617" : "#0B1220",
    },

    video: {
      width: "100%",
      height: 220,
    },

    centerState: {
      paddingVertical: 26,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    centerText: {
      color: muted,
      fontSize: 13,
      fontWeight: "900",
      textAlign: "center",
    },

    retryBox: {
      marginTop: 18,
      alignSelf: "center",
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      height: 44,
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: softBorder,
      ...shadowCard,
    },

    retryText: {
      color: muted,
      fontSize: 12.5,
      fontWeight: "900",
      textAlign: "right",
    },
  });
}