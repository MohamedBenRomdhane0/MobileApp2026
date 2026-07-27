import { StyleSheet, Dimensions } from "react-native";

const { width: W } = Dimensions.get("window");
const BOOK_W = (W - 16 * 2 - 14) / 2;

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

export function createHomeStyles(colors: any, isDark: boolean) {
  const TITLE_BLUE = "#1D3B65";

  const titleColor = isDark ? colors.text : TITLE_BLUE;

  const cardBg = colors.card;
  const bg = colors.bg;
  const muted = colors.muted;

  const softBorder = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.20)";
  const categoryCardBg = isDark ? "rgba(255,255,255,0.04)" : "#EEF4FF";

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: bg },

    scroll: { flex: 1, backgroundColor: bg },
    scrollContent: { paddingBottom: 120, backgroundColor: bg },

    headerShell: { paddingHorizontal: 0, backgroundColor: colors.header },

    headerGradient: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      minHeight: 200,
      overflow: "hidden",
      backgroundColor: colors.header,
      ...shadowHeader,
    },

    headerGlowA: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: "rgba(34,190,200,0.18)",
      top: -110,
      left: -80,
    },

    headerGlowB: {
      position: "absolute",
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -140,
      right: -100,
    },

    heroCenter: {
      marginTop: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    heroAvatarWrap: {
      width: 78,
      height: 78,
      borderRadius: 39,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.16)",
    },

    heroLevelPill: {
      marginTop: 6,
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingHorizontal: 12,
      height: 32,
      borderRadius: 999,
      backgroundColor: "rgba(15,23,42,0.32)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },

    heroLevelText: {
      color: "#F8FAFC",
      fontSize: 12.5,
      fontWeight: "900",
      textAlign: "right",
    },

    heroHello: {
      marginTop: 8,
      color: "rgba(255,255,255,0.78)",
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "center",
    },

    body: {
      paddingHorizontal: 16,
      paddingTop: 14,
      marginTop: -22,
    },

    categoriesCard: {
      backgroundColor: categoryCardBg,
      borderRadius: 22,
      paddingHorizontal: 12,
      paddingTop: 14,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: softBorder,
      ...shadowCard,
    },

    materialsStateWrap: {
      width: "100%",
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    categoriesRow: {
      alignItems: "flex-start",
      flexWrap: "nowrap",
    },

    categoryBlock: {
      alignItems: "center",
    },

    categoryItem: {
      width: 60,
      height: 60,
      borderRadius: 18,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.18)",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },

    categoryImg: { width: 30, height: 30, resizeMode: "contain" },

    categoryLabel: {
      marginTop: 8,
      fontSize: 10.5,
      color: muted,
      fontWeight: "900",
      textAlign: "center",
    },

    subscribeBanner: {
      marginTop: 12,
      borderRadius: 22,
      overflow: "hidden",
      ...shadowCard,
    },

    subscribeContent: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },

    subscribeTextBlock: {
      alignItems: "flex-end",
      flex: 1,
      paddingLeft: 12,
    },

    subscribeTitle: {
      color: "#FFFFFF",
      fontSize: 15.5,
      fontWeight: "900",
      textAlign: "right",
    },

    subscribeSub: {
      marginTop: 3,
      color: "rgba(255,255,255,0.92)",
      fontSize: 11.5,
      fontWeight: "800",
      textAlign: "right",
    },

    subscribeBtn: {
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
      paddingHorizontal: 18,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    subscribeBtnText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "900" },

    sectionHeaderRow: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      color: titleColor,
      fontSize: 18,
      fontWeight: "900",
      textAlign: "right",
    },

    sectionLink: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "900",
    },

    booksRow: {
      marginTop: 12,
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },

    booksStateWrap: {
      width: "100%",
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    bookCardOuter: {
      width: BOOK_W,
      borderRadius: 22,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F7F5F2",
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.10)",
      ...shadowCard,
    },

    bookCoverShell: {
      position: "relative",
      width: "100%",
      height: 138,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#ECE7DF",
      alignItems: "center",
      justifyContent: "center",
    },

    bookCoverImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },

    bookCoverFallback: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF2F7",
    },

    bookBadgeOverlay: {
      position: "absolute",
      right: 8,
      bottom: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      height: 24,
      borderRadius: 999,
      backgroundColor: "rgba(31,41,55,0.72)",
    },

    bookBadgeText: {
      color: "#FFFFFF",
      fontSize: 10.5,
      fontWeight: "900",
    },

    bookMetaWrap: {
      paddingTop: 8,
      alignItems: "center",
    },

    bookSubject: {
      color: "#14B8A6",
      fontSize: 12,
      fontWeight: "900",
      textAlign: "center",
    },

    bookTitle: {
      marginTop: 4,
      color: isDark ? colors.text : "#120350",
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "center",
      minHeight: 34,
    },

    bookOpenBtn: {
      marginTop: 12,
      width: "90%",
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#22C55E",
    },

    bookOpenText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    liveCard: {
      marginTop: 12,
      borderRadius: 22,
      backgroundColor: isDark ? "rgba(29,59,101,0.25)" : "#0F2E57",
      borderWidth: 1,
      borderColor: isDark ? "rgba(148,163,184,0.22)" : "transparent",
      paddingHorizontal: 14,
      paddingVertical: 14,
      ...shadowCard,
    },

    liveTopRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },

    liveInfo: { flex: 1, alignItems: "flex-end", paddingLeft: 12 },

    liveTitle: { color: "#FFFFFF", fontSize: 15.5, fontWeight: "900", textAlign: "right" },

    liveMeta: {
      marginTop: 4,
      color: "rgba(255,255,255,0.75)",
      fontSize: 11.5,
      fontWeight: "800",
      textAlign: "right",
    },

    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      height: 30,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },

    liveBadgeText: { color: "#FFFFFF", fontSize: 11.5, fontWeight: "900", letterSpacing: 0.7 },

    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },

    liveJoinBtn: {
      alignSelf: "flex-end",
      marginTop: 12,
      backgroundColor: "#F43F5E",
      paddingHorizontal: 20,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    liveJoinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  });
}