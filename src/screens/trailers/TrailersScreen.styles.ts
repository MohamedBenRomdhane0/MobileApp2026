import { Dimensions, StyleSheet } from "react-native";

const { width: W, height: H } = Dimensions.get("window");
export const CARD_W = (W - 32 - 10) / 2;

type ThemeColors = {
  bg?: string; text?: string; muted?: string;
  border?: string; primary?: string; card?: string; danger?: string;
} | undefined;

export function getTrailersPalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg:          colors?.bg      ?? (isDark ? "#07111D" : "#0a1225"),
    text:        colors?.text    ?? (isDark ? "#F8FAFC" : "#FFFFFF"),
    muted:       colors?.muted   ?? (isDark ? "#94A3B8" : "rgba(255,255,255,0.55)"),
    border:      colors?.border  ?? (isDark ? "rgba(148,163,184,0.18)" : "rgba(255,255,255,0.12)"),
    primary:     colors?.primary ?? "#22BEC8",
    card:        colors?.card    ?? (isDark ? "#0D1726" : "#0f1f3a"),
    danger:      colors?.danger  ?? "#EF4444",
    white:       "#FFFFFF",
    navy:        "#0F2E57",
    gold:        "#F5A623",
    darkOverlay: "rgba(0,0,0,0.55)",
  };
}

const sh = {
  shadowColor: "#000",
  shadowOpacity: 0.30,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
};

export const trailersStyles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#08111f" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  // ── HEADER ──────────────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: "hidden",
  },

  headerGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -70,
    left: -50,
    backgroundColor: "rgba(34,190,200,0.16)",
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  scheduleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  scheduleBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  titleBlock: {
    alignItems: "flex-end",
    marginBottom: 12,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 32,
  },

  screenSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 3,
  },

  // confirm bar
  confirmBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#22BEC8",
  },

  confirmBtnDisabled: {
    backgroundColor: "rgba(34,190,200,0.35)",
  },

  confirmBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  chooseLabelWrap: {
    alignItems: "flex-end",
    flex: 1,
    paddingEnd: 4,
  },

  chooseLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },

  chooseSub: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.50)",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
  },

  // ── SELECTED BANNER ─────────────────────────────────────
  selectedBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 2,
  },

  selectedBannerBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22BEC8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  selectedBannerBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  selectedBannerText: {
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  // ── FILTER CHIPS ────────────────────────────────────────
  filtersScroll:  { marginVertical: 10 },

  filtersContent: {
    flexDirection: "row-reverse",
    gap: 8,
    paddingHorizontal: 16,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  // ── GRID ────────────────────────────────────────────────
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 4,
  },

  // ── CARD (kept for TeacherTrailerCard usage) ─────────────
  card: {
    width: CARD_W,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#0f1e35",
    ...sh,
  },

  cardSelected: {
    borderWidth: 2.5,
    borderColor: "#22BEC8",
  },

  videoShell: {
    width: "100%",
    height: CARD_W * 0.75,
    position: "relative",
    overflow: "hidden",
  },

  videoGradient: StyleSheet.absoluteFill,

  avatarInVideo: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "rgba(34,190,200,0.18)",
    borderWidth: 1.5,
    borderColor: "rgba(34,190,200,0.45)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarInVideoImage: { width: "100%", height: "100%", borderRadius: 9 },
  avatarInVideoText:  { fontSize: 15, fontWeight: "900", color: "#FFFFFF" },

  playCircle: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  nextBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  nextBadgeDot:  { width: 6, height: 6, borderRadius: 3 },
  nextBadgeText: { fontSize: 9, fontWeight: "900", color: "#FFFFFF" },

  selectCircle: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  selectCircleActive: {
    borderColor: "#22BEC8",
    backgroundColor: "#22BEC8",
  },

  cardBody: {
    padding: 10,
    gap: 4,
  },

  cardTeacherName: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },

  cardSubjectRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  cardSubjectText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.50)",
    writingDirection: "rtl",
  },

  cardPriceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  cardPrice:     { fontSize: 13, fontWeight: "900", color: "#22BEC8" },
  cardPriceUnit: { fontSize: 9,  fontWeight: "700", color: "rgba(255,255,255,0.40)" },

  cardRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  cardRatingText: { fontSize: 10, fontWeight: "800", color: "#F5A623" },

  cardScheduleText: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.40)",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
  },

  cardActions: {
    flexDirection: "row-reverse",
    gap: 6,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  cardActionBtn: {
    flex: 1,
    height: 34,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  cardActionBtnText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  cardActionBtnPrimary: {
    backgroundColor: "rgba(34,190,200,0.15)",
    borderColor: "#22BEC8",
  },

  cardActionBtnPrimaryText: {
    color: "#22BEC8",
  },

  // ── VIDEO PLAYER MODAL ───────────────────────────────────
  playerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  playerBackdrop: StyleSheet.absoluteFill,

  playerCard: {
    width: W - 32,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#0a1628",
    borderWidth: 1,
    borderColor: "rgba(34,190,200,0.25)",
  },

  playerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },

  playerCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  playerVideo: {
    width: "100%",
    height: (W - 32) * 0.56,
  },

  playerNoVideo: {
    height: (W - 32) * 0.56,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  playerNoVideoText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.45)",
    writingDirection: "rtl",
  },

  // ── STATES ──────────────────────────────────────────────
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
  },

  stateText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
  },

  retryBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 130,
    justifyContent: "center",
  },

  retryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },

  emptySubtitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
  },
});