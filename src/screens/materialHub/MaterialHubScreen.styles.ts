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

export function createMaterialHubStyles(colors: any, isDark: boolean) {
  const bg = colors.bg;
  const card = colors.card;
  const text = colors.text;
  const muted = colors.muted;

  const header = colors.header;
  const primary = colors.primary;

  const softBorder = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.20)";
  const pillBgSoft = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.92)";
  const glass = isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.16)";

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: bg },
    scroll: { flex: 1, backgroundColor: bg },
    scrollContent: { paddingBottom: 34, backgroundColor: bg, paddingHorizontal: 16, paddingTop: 14 },

    headerShell: { backgroundColor: header },
    headerGradient: {
      paddingHorizontal: 16,
      paddingBottom: 18,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      minHeight: 152,
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

    headerTitles: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
    headerRightSlot: { width: 42, height: 42 },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: 0.2,
    },

    headerSub: {
      marginTop: 4,
      color: "rgba(255,255,255,0.78)",
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "center",
    },

    tabsShell: { marginTop: -18, paddingBottom: 10 },

    tabsRow: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: 14,
      alignItems: "center",
    },

    tabsRowInner: {
      flexDirection: "row-reverse",
      gap: 10,
      alignItems: "center",
    },

    tabPill: {
      height: 40,
      borderRadius: 14,
      paddingHorizontal: 14,
      backgroundColor: pillBgSoft,
      borderWidth: 1,
      borderColor: softBorder,
      ...shadowCard,
    },

    tabPillInner: {
      flex: 1,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    tabText: {
      fontSize: 12.5,
      fontWeight: "900",
      color: muted,
      textAlign: "right",
      maxWidth: 120,
    },

    tabDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", marginRight: 2 },

    section: { paddingTop: 8 },

    sectionTitle: { marginTop: 8, fontSize: 16.5, fontWeight: "900", color: text, textAlign: "right" },
    sectionSub: { marginTop: 6, fontSize: 12.5, fontWeight: "800", color: muted, textAlign: "right" },

    card: {
      marginTop: 12,
      borderRadius: 22,
      backgroundColor: card,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
    },

    cardHeader: {
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 12,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },

    cardHeaderRight: { flex: 1, alignItems: "flex-end", paddingLeft: 10 },
    cardHeaderIcon: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(34,190,200,0.18)" : "rgba(34,190,200,0.14)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(34,190,200,0.28)" : "rgba(34,190,200,0.22)",
    },

    cardHeaderTitle: { fontSize: 15, fontWeight: "900", color: text, textAlign: "right" },
    cardHeaderMeta: { marginTop: 4, fontSize: 12, fontWeight: "800", color: muted, textAlign: "right" },

    progressRow: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(226,232,240,0.14)" : "rgba(15,23,42,0.08)",
      overflow: "hidden",
    },
    progressFill: { height: "100%", borderRadius: 999 },
    progressLabelRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
    progressLabel: { fontSize: 12, fontWeight: "900", color: muted, textAlign: "right" },

    divider: { height: 1, backgroundColor: softBorder },

    cardTitle: {
      paddingHorizontal: 14,
      paddingTop: 14,
      fontSize: 14.5,
      fontWeight: "900",
      color: text,
      textAlign: "right",
    },

    listRow: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: softBorder,
    },

    listRowFirst: { borderTopWidth: 0 },

    listTitle: { flex: 1, fontSize: 13, fontWeight: "900", color: text, textAlign: "right" },
    listMeta: { marginRight: 10, fontSize: 12, fontWeight: "800", color: muted, textAlign: "right" },

    primaryBtn: {
      marginTop: 14,
      marginBottom: 16,
      alignSelf: "center",
      width: "90%",
      height: 52,
      borderRadius: 18,
      overflow: "hidden",
    },

    primaryBtnInner: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row-reverse",
      gap: 10,
    },

    primaryBtnText: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "900" },

    emptyState: { marginTop: 44, alignItems: "center", justifyContent: "center", paddingVertical: 34, gap: 10 },
    emptyTitle: { fontSize: 15, fontWeight: "900", color: text, textAlign: "center" },
    emptySub: { fontSize: 12, fontWeight: "800", color: muted, textAlign: "center" },

    bookList: { paddingTop: 12, paddingBottom: 4 },

    bookCard: {
      borderRadius: 20,
      backgroundColor: card,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
    },

    bookCoverWrap: { height: 120, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(2,6,23,0.03)" },
    bookCover: { width: "100%", height: "100%" },
    bookCoverEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
    bookCoverEmptyText: { fontSize: 11.5, fontWeight: "800", color: muted },

    bookBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      height: 28,
      borderRadius: 999,
      backgroundColor: "rgba(15,23,42,0.68)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
    bookBadgeText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "900" },

    bookBody: { paddingHorizontal: 14, paddingVertical: 12 },
    bookTitle: { fontSize: 14.5, fontWeight: "900", color: text, textAlign: "right" },
    bookMeta: { fontSize: 12, fontWeight: "800", color: muted, textAlign: "right" },

    bookProgressRow: { marginTop: 10, gap: 8 },
    bookFooterRow: { marginTop: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
    bookCta: {
      width: 36,
      height: 36,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.04)",
      borderWidth: 1,
      borderColor: softBorder,
    },

    centerState: { paddingVertical: 18, alignItems: "center", justifyContent: "center", gap: 8 },
    centerStateText: { fontSize: 13, fontWeight: "900", color: text, textAlign: "center" },
    centerStateSub: { fontSize: 12, fontWeight: "800", color: muted, textAlign: "center" },

    retryBox: {
      marginTop: 12,
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

    gridListContent: { paddingTop: 12, paddingBottom: 4 },
    gridColWrapper: { gap: 12 },

    gridCardWrap: { flex: 1 },
    gridCard: {
      flex: 1,
      borderRadius: 20,
      backgroundColor: card,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
    },

    gridCoverBg: {
      width: "100%",
      height: 190,
      justifyContent: "flex-end",
    },
    gridCoverOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.28)",
    },
    gridThumbWrap: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 52,
      height: 68,
      borderRadius: 10,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.35)",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    gridThumb: { width: "100%", height: "100%" },

    gridCover: { width: "100%", height: 150 },
    gridCoverEmpty: {
      height: 190,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(2,6,23,0.03)",
    },
    gridCoverEmptyText: { fontSize: 11.5, fontWeight: "800", color: muted },

    gridBody: { paddingHorizontal: 12, paddingVertical: 10 },
    gridTitle: { fontSize: 13.5, fontWeight: "900", color: text, textAlign: "right" },

    gridPill: {
      marginTop: 10,
      alignSelf: "flex-start",
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      height: 36,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.04)",
      borderWidth: 1,
      borderColor: softBorder,
    },
    gridPillText: { fontSize: 12, fontWeight: "900", color: muted, textAlign: "right" },

    gridProgressRow: { marginTop: 10, gap: 8 },
    gridPct: { fontSize: 12, fontWeight: "900", color: muted, textAlign: "right" },
    gridTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(226,232,240,0.14)" : "rgba(15,23,42,0.08)",
      overflow: "hidden",
    },
    gridFill: { height: "100%", borderRadius: 999 },

    gridCtaRow: {
      marginTop: 10,
      alignItems: "flex-start",
    },

    retryText: { fontSize: 12.5, fontWeight: "900", color: muted, textAlign: "right" },

    __PRIMARY: primary,

     courseBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      height: 28,
      borderRadius: 999,
      backgroundColor: "rgba(15,23,42,0.66)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
    courseBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
      textAlign: "right",
    },

    coverFallbackLabel: {
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    coverFallbackText: {
      color: "rgba(255,255,255,0.92)",
      fontSize: 11.5,
      fontWeight: "900",
      textAlign: "center",
    },

    teacherRow: {
      marginTop: 8,
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 8,
    },
    teacherAvatar: { width: 22, height: 22, borderRadius: 11 },
    teacherName: {
      flex: 1,
      fontSize: 12,
      fontWeight: "900",
      color: muted,
      textAlign: "right",
    },

    courseCtaWrap: { marginTop: 12, borderRadius: 14, overflow: "hidden" },
    courseCta: {
      height: 40,
      borderRadius: 14,
      paddingHorizontal: 12,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },
    courseCtaText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "900", textAlign: "right" },
  });
}