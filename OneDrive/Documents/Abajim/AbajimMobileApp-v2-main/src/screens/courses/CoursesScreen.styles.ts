import { StyleSheet, Platform } from "react-native";

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

export function createCoursesStyles(colors: any, isDark: boolean) {
  const bg = colors.bg;
  const card = colors.card;
  const text = colors.text;
  const muted = colors.muted;
  const border = colors.border;

  const header = colors.header;
  const primary = colors.primary;

  const softBorder = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.20)";
  const glass = isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.16)";

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: bg },

    headerShell: { backgroundColor: header },
    headerGradient: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      minHeight: 160,
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
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
      flex: 1,
      paddingHorizontal: 10,
    },

    headerRightSlot: { width: 42, height: 42 },

    searchWrap: {
      marginTop: 14,
      height: 46,
      borderRadius: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
      borderWidth: 1,
      borderColor: softBorder,
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingHorizontal: 12,
      gap: 10,
      ...shadowCard,
    },

    searchInput: {
      flex: 1,
      color: text,
      fontSize: 13.5,
      fontWeight: "800",
      textAlign: "right",
    },

    listContent: { paddingBottom: 24, paddingTop: 14 },

    cardWrap: { paddingHorizontal: 16, paddingTop: 12 },

    card: {
      backgroundColor: card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
      flexDirection: "row-reverse",
      alignItems: "center",
      padding: 12,
      gap: 12,
    },

    cover: {
      width: 92,
      height: 120,
      borderRadius: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
    },

    details: { flex: 1, alignItems: "flex-end" },

    titleRow: { width: "100%", flexDirection: "row-reverse", alignItems: "flex-start", justifyContent: "space-between" },

    title: { flex: 1, color: text, fontSize: 15.5, fontWeight: "900", textAlign: "right" },

    favBtn: {
      width: 38,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.04)",
      borderWidth: 1,
      borderColor: softBorder,
      marginRight: 10,
    },

    metaRow: { marginTop: 8, flexDirection: "row-reverse", alignItems: "center", gap: 8 },

    teacherAvatar: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
    },

    teacherName: { color: primary, fontSize: 12.5, fontWeight: "900", textAlign: "right", maxWidth: 210 },

    materialText: { marginTop: 6, color: muted, fontSize: 12, fontWeight: "800", textAlign: "right" },

    cta: {
      marginTop: 10,
      alignSelf: "flex-end",
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: primary,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    ctaText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "900" },

    centerState: { paddingVertical: 26, alignItems: "center", justifyContent: "center", gap: 10 },
    centerText: { color: muted, fontSize: 13, fontWeight: "900", textAlign: "center" },

    retryBox: {
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

    retryText: { color: muted, fontSize: 12.5, fontWeight: "900", textAlign: "right" },

    divider: { height: 1, backgroundColor: border },

    __PRIMARY: primary,
  });
}