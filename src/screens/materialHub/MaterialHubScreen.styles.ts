import { StyleSheet, Platform, I18nManager } from "react-native";

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
  const isRTL = I18nManager.isRTL;

  const softBorder = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.20)";
  const pillBgSoft = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.92)";
  const glass = isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.16)";

  const hubBg = isDark ? "#0D1B2A" : "#F0F4FF";

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: hubBg },
    scroll: { flex: 1, backgroundColor: hubBg },
    scrollContent: { paddingBottom: 34, backgroundColor: hubBg, paddingHorizontal: 16, paddingTop: 14 },

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

    centerState: { paddingVertical: 18, alignItems: "center", justifyContent: "center", gap: 8 },
    centerStateText: { fontSize: 13, fontWeight: "900", color: text, textAlign: "center" },
    centerStateSub: { fontSize: 12, fontWeight: "800", color: muted, textAlign: "center" },

    retryBox: {
      marginTop: 12,
      alignSelf: "center",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 24,
      paddingVertical: 18,
      borderRadius: 18,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: softBorder,
      ...shadowCard,
    },
    retryIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.04)",
      marginBottom: 4,
    },
    retryTitle: { fontSize: 14, fontWeight: "900", color: text, textAlign: "center" },
    retryText: { fontSize: 12, fontWeight: "800", color: muted, textAlign: "center" },

    emptyStateBox: {
      marginTop: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 28,
      paddingHorizontal: 20,
      gap: 8,
    },
    emptyStateIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(2,6,23,0.04)",
      marginBottom: 4,
    },
    emptyStateTitle: { fontSize: 15, fontWeight: "900", color: text, textAlign: "center" },
    emptyStateSub: { fontSize: 13, fontWeight: "800", color: muted, textAlign: "center", lineHeight: 18 },

    skeletonGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      paddingTop: 12,
    },
    skeletonCard: {
      flex: 1,
      minWidth: "45%",
      borderRadius: 20,
      backgroundColor: card,
      borderWidth: 1,
      borderColor: softBorder,
      overflow: "hidden",
      ...shadowCard,
    },
    skeletonCover: {
      width: "100%",
      height: 140,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.06)",
    },
    skeletonBody: { padding: 14, gap: 8 },
    skeletonLineLong: {
      height: 12,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(2,6,23,0.08)",
      width: "100%",
    },
    skeletonLineMedium: {
      height: 12,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(2,6,23,0.08)",
      width: "70%",
    },
    skeletonLineShort: {
      height: 12,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(2,6,23,0.08)",
      width: "45%",
    },

    gridListContent: { paddingTop: 12, paddingBottom: 4 },

    bookCardShadow: {
      borderRadius: 28,
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    bookCard: {
      height: 260,
      borderRadius: 28,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.07)",
    },
    bookCardRow: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "stretch",
    },

    bookCoverWrap: {
      width: "48%",
      overflow: "visible",
    },
    bookCoverPad: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 28,
      marginTop: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    coverStage: {
      width: "100%",
      flex: 1,
    },
    bookCoverCard: {
      width: "100%",
      flex: 1,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.85)",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    bookCoverImg: { width: "100%", height: "100%" },
    bookCoverFallback: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    bookCoverGloss: [StyleSheet.absoluteFill, {
      borderRadius: 12,
    }] as unknown as import("react-native").ViewStyle,
    bookCoverBadge: {
      position: "absolute",
      left: "50%",
      bottom: 10,
      transform: [{ translateX: -30 }],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 60,
      height: 28,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: "rgba(6,14,24,0.82)",
      gap: 5,
      zIndex: 4,
    },
    bookCoverBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

    bookInfoWrap: {
      flex: 1,
      overflow: "hidden",
    },
    bookInfoContent: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 14,
      justifyContent: "space-between",
    },
    bookTitleBlock: { marginBottom: 4 },
    bookTitleText: {
      color: "#FFFFFF",
      fontSize: 22,
      lineHeight: 26,
      fontWeight: "900",
      letterSpacing: -0.3,
    },
    bookMiddleSection: { marginTop: 4 },
    bookResumeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
    },
    bookResumeLabel: {
      color: "rgba(255,255,255,0.58)",
      fontSize: 11,
      fontWeight: "600",
    },
    bookResumeProgressRow: {
      width: "100%",
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 6,
      gap: 6,
    },
    bookResumeProgressTrack: {
      flex: 1,
      height: 7,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      overflow: "hidden",
    },
    bookResumeProgressFill: { height: "100%", borderRadius: 999 },
    bookResumeProgressPct: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
      minWidth: 38,
    },
    bookPageChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      height: 32,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
    },
    bookPageChipText: { color: "rgba(255,255,255,0.84)", fontSize: 12, fontWeight: "700" },
    bookBottomSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },
    bookChipsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    bookCountChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      height: 26,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
    },
    bookCountChipText: { color: "rgba(255,255,255,0.90)", fontSize: 11, fontWeight: "700" },
    bookOpenButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 36,
      paddingHorizontal: 16,
      borderRadius: 999,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    bookOpenButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

    bookHList: {
      flexDirection: isRTL ? "row-reverse" : "row",
      paddingTop: 14,
      paddingBottom: 4,
      gap: 14,
    },
    bookHItem: {
      width: 224,
    },

    hBookCardShadow: {
      width: "100%",
      borderRadius: 24,
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    hBookCard: {
      height: 424,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.07)",
    },

    hBookCoverWrap: {
      paddingHorizontal: 12,
      paddingTop: 14,
      paddingBottom: 8,
    },
    hBookCoverPad: {
      height: 232,
      alignItems: "center",
      justifyContent: "center",
    },
    hBookCoverCard: {
      width: "100%",
      flex: 1,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.85)",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    hBookCoverImg: { width: "100%", height: "100%" },
    hBookCoverFallback: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    hBookCoverGloss: [StyleSheet.absoluteFill, {
      borderRadius: 12,
    }] as unknown as import("react-native").ViewStyle,
    hBookBadge: {
      position: "absolute",
      left: "50%",
      bottom: 12,
      transform: [{ translateX: -30 }],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 60,
      height: 28,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: "rgba(6,14,24,0.82)",
      gap: 5,
      zIndex: 4,
    },
    hBookBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

    hBookInfo: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 14,
      justifyContent: "space-between",
    },
    hBookTitleBlock: { marginBottom: 4 },
    hBookTitleText: {
      color: "#FFFFFF",
      fontSize: 17,
      lineHeight: 21,
      fontWeight: "900",
      letterSpacing: -0.3,
    },
    hResumeHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
      marginBottom: 4,
    },
    hResumeHeaderText: {
      color: "rgba(255,255,255,0.58)",
      fontSize: 10.5,
      fontWeight: "700",
    },
    hBookMiddle: { marginTop: 2 },
    hResumeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
    },
    hResumeLabel: {
      color: "rgba(255,255,255,0.58)",
      fontSize: 10.5,
      fontWeight: "600",
    },
    hResumeTitle: {
      color: "#FFFFFF",
      fontSize: 12.5,
      fontWeight: "700",
    },
    hResumeTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    hResumeTimeText: {
      color: "rgba(255,255,255,0.58)",
      fontSize: 10.5,
      fontWeight: "600",
    },
    hProgressRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 6,
      gap: 6,
    },
    hProgressTrack: {
      flex: 1,
      height: 7,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      overflow: "hidden",
    },
    hProgressFill: { height: "100%", borderRadius: 999 },
    hProgressPct: {
      color: "#FFFFFF",
      fontSize: 11.5,
      fontWeight: "700",
      minWidth: 34,
    },
    hPageChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      height: 30,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
    },
    hPageChipText: { color: "rgba(255,255,255,0.84)", fontSize: 11.5, fontWeight: "700" },
    hBookFooter: {
      marginTop: 8,
      alignItems: "stretch",
    },
    hOpenButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 36,
      borderRadius: 999,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    hOpenButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

    __PRIMARY: primary,

    meetingCard: {
      flexDirection: "row",
      backgroundColor: card,
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden",
      ...shadowCard,
    },
    meetingCardFirst: { marginTop: 4 },
    meetingCardAccent: { width: 5, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
    meetingCardBody: { flex: 1, padding: 14 },
    meetingCardHeader: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    meetingCardName: { flex: 1, fontSize: 15, fontWeight: "900", color: text, textAlign: "right", marginLeft: 8 },
    liveIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#EF4444",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
    liveText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
    meetingMetaRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    meetingMetaText: { flex: 1, fontSize: 12.5, color: muted, textAlign: "right" },
    meetingFooter: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    meetingPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
    meetingPriceOld: { fontSize: 12, color: muted, textDecorationLine: "line-through" },
    meetingPrice: { fontSize: 15, fontWeight: "900" },
    meetingCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    meetingCtaText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
    meetingSessionCount: {
      fontSize: 11,
      color: muted,
      textAlign: "right",
      marginTop: 6,
    },
  });
}