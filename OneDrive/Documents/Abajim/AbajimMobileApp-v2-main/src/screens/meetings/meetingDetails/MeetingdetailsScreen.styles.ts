import { StyleSheet } from "react-native";

type ThemeColors =
  | {
      bg?: string;
      text?: string;
      muted?: string;
      border?: string;
      primary?: string;
      primaryDark?: string;
      card?: string;
      danger?: string;
    }
  | undefined;

export function getMeetingDetailPalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg:          colors?.bg          ?? (isDark ? "#07111D" : "#F0F4FF"),
    text:        colors?.text        ?? (isDark ? "#F8FAFC" : "#0D1225"),
    muted:       colors?.muted       ?? (isDark ? "#94A3B8" : "#8892B0"),
    border:      colors?.border      ?? (isDark ? "rgba(148,163,184,0.18)" : "#E7EDF5"),
    primary:     colors?.primary     ?? "#22BEC8",
    primaryDark: colors?.primaryDark ?? "#1aa8b0",
    card:        colors?.card        ?? (isDark ? "#0D1726" : "#FFFFFF"),
    danger:      colors?.danger      ?? "#EF4444",
    softSurface: isDark ? "rgba(255,255,255,0.05)" : "#F4F7FF",
    softBorder:  isDark ? "rgba(255,255,255,0.08)" : "#E7EDF5",
    gold:        "#F5A623",
    white:       "#FFFFFF",
  };
}

const sh = {
  shadowColor:  "#000",
  shadowOpacity: 0.07,
  shadowRadius:  12,
  shadowOffset:  { width: 0, height: 4 },
  elevation:     4,
};

export const meetingDetailStyles = StyleSheet.create({
  container:     { flex: 1 },
  scrollContent: { flexGrow: 1 },

  hero: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    overflow: "hidden",
  },

  heroOrb1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -70,
    right: -50,
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  heroOrb2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 999,
    bottom: -40,
    left: -30,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
    heroTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    },

    heroTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    },
  heroSubjectBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  heroSubjectBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  heroBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroBody: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    gap: 14,
  },

  heroTitleWrap: {
    flex: 1,
    alignItems: "flex-end",
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 32,
    marginBottom: 8,
  },

  heroMetaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },

  heroMetaDot: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 12,
  },

  heroMetaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.68)",
    writingDirection: "rtl",
  },

  heroRatingRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  heroRatingText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFD700",
  },

  heroAvatarWrap: {
    ...sh,
    shadowOpacity: 0.22,
    borderRadius: 18,
  },

  heroAvatar: {
    width: 68,
    height: 68,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },

  heroAvatarText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  cardsArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    gap: 12,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    ...sh,
  },

  cardSectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  teacherRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },

  teacherAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },

  teacherAvatarText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  teacherInfo: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },

  teacherName: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  teacherMeta: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
  },

  profileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  profileBtnText: {
    fontSize: 11,
    fontWeight: "900",
    writingDirection: "rtl",
  },

  teacherBadgesRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(13,18,37,0.06)",
  },

  teacherBadgeChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },

  teacherBadgeEmoji: { fontSize: 13 },

  teacherBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  chipsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },

  chipIcon: { fontSize: 13 },

  chipText: {
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  scheduleRows: {
    gap: 8,
    marginBottom: 10,
  },

  scheduleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 13,
    gap: 10,
  },

  scheduleDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    flexShrink: 0,
  },

  scheduleDay: {
    fontSize: 13,
    fontWeight: "900",
    writingDirection: "rtl",
    minWidth: 38,
    textAlign: "right",
  },

  scheduleTime: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "left",
    writingDirection: "ltr",
  },

  scheduleDuration: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 0,
  },

  nextSessionAlert: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: "rgba(245,166,35,0.08)",
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.22)",
  },

  nextSessionIcon: { fontSize: 14 },

  nextSessionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: "#B07800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  descriptionText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 22,
    textAlign: "right",
    writingDirection: "rtl",
  },

  groupsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },

  groupsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },

  groupsBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    writingDirection: "rtl",
  },

  upcomingChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-end",
  },

  upcomingChipText: {
    fontSize: 12,
    fontWeight: "700",
    writingDirection: "rtl",
  },

  reviewChip: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 6,
    alignItems: "flex-end",
  },

  reviewChipStars: {
    flexDirection: "row-reverse",
    gap: 2,
  },

  reviewChipAuthor: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  reviewChipComment: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  priceCol:  { alignItems: "flex-end" },

  priceValue: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "right",
    letterSpacing: -0.5,
  },

  priceUnit: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 1,
  },

  bookBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowOpacity: 0.30,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    minWidth: 150,
  },

  bookBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 14,
  },

  stateText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
  },

  stateTitle: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },

  retryBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    minWidth: 130,
  },

  retryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },
});
