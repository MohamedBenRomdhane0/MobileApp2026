import { StyleSheet } from "react-native";

/**
 * Palette for the agenda screen: soft light canvas, deep-navy ink and the
 * app teal as the single interactive accent (see .claude/skills/frontend-design).
 */
export const C = {
  canvas: "#EEF3F8",
  surface: "#FFFFFF",
  ink: "#122A4E",
  sub: "#64748B",
  muted: "#9AA6B8",
  hairline: "#EDF1F6",
  teal: "#22BEC8",
  tealSoft: "#E9F9FA",
  dark: "#12151F",
};

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.canvas,
  },

  /* Ambient glows behind the canvas ------------------------------------ */

  glowTop: {
    position: "absolute",
    top: -120,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(34,190,200,0.16)",
  },

  glowSide: {
    position: "absolute",
    top: 180,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(124,77,204,0.10)",
  },

  /* Header -------------------------------------------------------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.sub,
    marginTop: 2,
  },

  monthBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: C.surface,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  monthBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: C.ink,
  },

  content: {
    paddingHorizontal: 20,
  },

  /* Calendar card -------------------------------------------------------- */

  calendarCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 10,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 14,
  },

  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8FC",
  },

  arrowBtnDisabled: {
    opacity: 0.35,
  },

  pickerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: C.ink,
  },

  weekHeader: {
    flexDirection: "row",
    marginBottom: 6,
  },

  weekHeaderCell: {
    flex: 1,
    alignItems: "center",
  },

  weekHeaderText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: C.muted,
  },

  weekRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingTop: 4,
  },

  dayNumberWrap: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  dayNumberWrapToday: {
    backgroundColor: "#F1F5FA",
  },

  dayNumberWrapSelected: {
    backgroundColor: C.teal,
    shadowColor: C.teal,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  dayNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: C.ink,
  },

  dayNumberSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  dayDot: {
    marginTop: 5,
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "transparent",
  },

  /* Today banner --------------------------------------------------------- */

  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.dark,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 14,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  bannerIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,190,200,0.20)",
    marginRight: 10,
  },

  bannerText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  bannerClose: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    marginLeft: 8,
  },

  /* Section headers ------------------------------------------------------ */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.tealSoft,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.ink,
  },

  sectionCount: {
    backgroundColor: C.tealSoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    overflow: "hidden",
  },

  sectionCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.teal,
  },

  /* Teacher strip -------------------------------------------------------- */

  teacherStrip: {
    paddingRight: 8,
    gap: 10,
  },

  teacherCard: {
    width: 132,
    backgroundColor: C.surface,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#0D2A52",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  teacherPhotoWrap: {
    width: 58,
    height: 58,
    borderRadius: 999,
    borderWidth: 2,
    padding: 2.5,
    marginBottom: 9,
  },

  teacherPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  teacherCheck: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.surface,
  },

  teacherName: {
    fontSize: 12.5,
    fontWeight: "800",
    color: C.ink,
    textAlign: "center",
  },

  subjectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 7,
  },

  subjectDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },

  subjectPillText: {
    fontSize: 10.5,
    fontWeight: "800",
  },

  teacherMeta: {
    fontSize: 10,
    fontWeight: "600",
    color: C.muted,
    marginTop: 7,
  },

  /* Timeline ------------------------------------------------------------- */

  timelineCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    paddingTop: 6,
    paddingBottom: 14,
    paddingHorizontal: 14,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  timeline: {
    position: "relative",
  },

  hourRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  hourLabel: {
    width: 42,
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
  },

  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.hairline,
  },

  nowRow: {
    position: "absolute",
    left: 42,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  nowDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },

  nowLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "rgba(239,68,68,0.45)",
  },

  blockWrap: {
    position: "absolute",
    left: 48,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  block: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },

  blockInfo: {
    flex: 1,
    paddingRight: 8,
  },

  blockTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0B2033",
  },

  blockTime: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(11,32,51,0.65)",
    marginTop: 2,
  },

  blockMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },

  blockChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  blockChipText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#0B2033",
  },

  progressPill: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  progressPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0B2033",
  },

  blockAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: C.surface,
  },

  /* Empty state ---------------------------------------------------------- */

  empty: {
    alignItems: "center",
    paddingVertical: 34,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.tealSoft,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: C.ink,
  },

  emptyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
    marginTop: 4,
    textAlign: "center",
  },

  /* FAB ------------------------------------------------------------------ */

  fab: {
    position: "absolute",
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 999,
    shadowColor: C.teal,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  fabInner: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Month picker sheet ---------------------------------------------------- */

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(9,20,38,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#DDE4EE",
    marginBottom: 14,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.ink,
    marginBottom: 12,
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  monthItem: {
    width: "31.5%",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F5F8FC",
  },

  monthItemActive: {
    backgroundColor: C.teal,
  },

  monthItemText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.ink,
  },

  monthItemTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});

export default S;
