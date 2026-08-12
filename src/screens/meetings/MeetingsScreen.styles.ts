import { StyleSheet } from "react-native";

type ThemeColors =
  | {
      bg?: string;
      text?: string;
      muted?: string;
      border?: string;
      primary?: string;
      primaryDark?: string;
      header?: string;
      card?: string;
      danger?: string;
    }
  | undefined;

export function getMeetingsPalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg: colors?.bg ?? (isDark ? "#07111D" : "#F0F4FF"),
    text: colors?.text ?? (isDark ? "#F8FAFC" : "#0D1225"),
    muted: colors?.muted ?? (isDark ? "#94A3B8" : "#8892B0"),
    border: colors?.border ?? (isDark ? "rgba(148,163,184,0.18)" : "#E7EDF5"),
    primary: colors?.primary ?? "#22BEC8",
    primaryDark: colors?.primaryDark ?? "#1aa8b0",
    header: colors?.header ?? "#163867",
    card: colors?.card ?? (isDark ? "#0D1726" : "#FFFFFF"),
    danger: colors?.danger ?? "#EF4444",
    white: "#FFFFFF",
    buttonTextDark: "#10345A",
    softSurface: isDark ? "rgba(255,255,255,0.05)" : "#F4F7FF",
    softBorder: isDark ? "rgba(255,255,255,0.08)" : "#E7EDF5",
  };
}

const sh = {
  shadowColor: "#000",
  shadowOpacity: 0.07,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

export const meetingsStyles = StyleSheet.create({
  container: { flex: 1 },

  headerWrap: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    overflow: "hidden",
  },

  headerGlowLeft: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -80,
    left: -60,
    backgroundColor: "rgba(34,190,200,0.14)",
  },

  headerGlowRight: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    bottom: -60,
    right: -40,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  headerBubble: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 999,
    top: 10,
    right: 30,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  headerTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  headerLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },

  avatarButton: { borderRadius: 999 },

  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#FF5A67",
    borderWidth: 1.5,
    borderColor: "#163867",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.60)",
    textAlign: "center",
    writingDirection: "rtl",
  },

  searchWrap: {
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginTop: 14,
  },

  searchIcon: { marginStart: 8 },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  filtersCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 14,
    marginBottom: 12,
    ...sh,
  },

  categoriesContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
    flexDirection: "row-reverse",
  },

  categoryChip: {
    height: 36,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  categoryChipText: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "rtl",
  },

  materialsStateWrap: {
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  materialsRetryText: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },

  subjectsGrid: {
    paddingHorizontal: 10,
    paddingTop: 12,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  subjectCard: {
    width: "18.5%",
    minWidth: 58,
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  subjectIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  materialIcon: { width: 22, height: 22 },

  subjectTitle: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "rtl",
  },

  priceRangeCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    ...sh,
  },

  priceRangeHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  priceRangeTitle: {
    fontSize: 13,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  priceRangeValue: {
    fontSize: 12,
    fontWeight: "700",
  },

  priceRangeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },

  priceRangeNum: {
    fontSize: 11,
    fontWeight: "800",
    width: 28,
    textAlign: "center",
  },

  priceTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    justifyContent: "center",
  },

  priceTrackFill: {
    position: "absolute",
    left: "20%",
    right: "15%",
    height: "100%",
    borderRadius: 3,
  },

  priceThumbLeft: {
    position: "absolute",
    left: "20%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#22BEC8",
    marginLeft: -8,
    shadowColor: "#22BEC8",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  priceThumbRight: {
    position: "absolute",
    right: "15%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#22BEC8",
    marginRight: -8,
    shadowColor: "#22BEC8",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionHeaderLarge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  sectionCount: {
    fontSize: 14,
    fontWeight: "900",
  },

  featuredList: {
    marginBottom: 4,
  },

  featuredScrollContent: {
    paddingBottom: 6,
    paddingHorizontal: 2,
  },

  featuredSeparator: {
    width: 12,
  },

  featuredCardShadow: {
    width: 250,
    borderRadius: 22,
    ...sh,
    shadowOpacity: 0.12,
    overflow: "hidden",
    marginBottom: 6,
  },

  featuredCard: {
    minHeight: 270,
    borderRadius: 22,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  featuredTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  featuredSubjectBadge: {
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  featuredSubjectBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    writingDirection: "rtl",
  },

  featuredCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },

  featuredAvatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    overflow: "hidden",
  },

  featuredAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  featuredAvatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  featuredBottom: {
    flex: 1,
    justifyContent: "flex-end",
  },

  featuredMeetingLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 3,
  },

  featuredTeacherName: {
    minHeight: 42,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 10,
  },

  featuredMetaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },

  featuredMetaChip: {
    minHeight: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  featuredMetaIcon: { marginStart: 4 },

  featuredMetaText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    writingDirection: "rtl",
  },

  featuredActionRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  featuredOpenButton: {
    minWidth: 100,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFEFF",
    gap: 5,
  },

  featuredOpenButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#10345A",
    writingDirection: "rtl",
  },

  featuredPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
  },

  listContent: { paddingBottom: 130 },

  cardShadow: {
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 20,
    ...sh,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  cardHeaderLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  cardAvatarSquare: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    flexShrink: 0,
    overflow: "hidden",
  },

  cardAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
  },

  cardAvatarSquareText: {
    fontSize: 22,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "900",
  },

  cardHeaderNameCol: { flex: 1 },

  cardTeacherNameHeader: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },

  cardVerifiedBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.80)",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
  },

  cardBookmark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
  },

  cardSubjectPillRow: {
    flexDirection: "row-reverse",
    marginBottom: 10,
  },

  cardSubjectPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  cardSubjectPillText: {
    fontSize: 10.5,
    fontWeight: "900",
    writingDirection: "rtl",
  },

  cardInfoRows: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 12,
  },

  cardInfoRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 5,
  },

  cardInfoIcon: {
    fontSize: 13,
    lineHeight: 19,
    width: 18,
    textAlign: "center",
    flexShrink: 0,
  },

  cardInfoLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    writingDirection: "rtl",
    flexShrink: 0,
    lineHeight: 19,
  },

  cardInfoValue: {
    fontSize: 11.5,
    fontWeight: "800",
    writingDirection: "rtl",
    flex: 1,
    textAlign: "right",
    lineHeight: 19,
  },

  cardTimeRows: {
    flex: 1,
    gap: 2,
  },

  cardTimeRow: {
    fontSize: 11.5,
    writingDirection: "rtl",
    textAlign: "right",
    lineHeight: 19,
  },

  cardBottomRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    marginBottom: 6,
  },

  cardPriceCol: { alignItems: "flex-end" },

  cardPrice: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
  },

  cardPriceUnit: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 1,
  },

  bookBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 13,
    gap: 6,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  bookBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  cardFooter: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },

  cardFooterText: {
    fontSize: 10.5,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
    flex: 1,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    gap: 12,
  },

  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },

  emptySubtitle: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
    writingDirection: "rtl",
  },

  retryButton: {
    minWidth: 130,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    gap: 8,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    writingDirection: "rtl",
  },
});
