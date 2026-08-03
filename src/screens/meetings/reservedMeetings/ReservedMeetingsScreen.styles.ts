import { StyleSheet } from "react-native";

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FF",
  },

  headerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },

  headerGlowLeft: {
    position: "absolute",
    top: -60,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(34,190,200,0.22)",
  },

  headerGlowRight: {
    position: "absolute",
    top: 40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.18)",
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  headerCenter: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    marginTop: 2,
  },

  avatarWrap: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  content: {
    paddingHorizontal: 20,
  },

  calendarCard: {
    marginTop: -14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 12,
  },

  monthLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#122A4E",
  },

  monthChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EAF9FA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  monthChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0FA6B0",
  },

  dayStrip: {
    flexDirection: "row",
  },

  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 14,
  },

  dayCellActive: {
    backgroundColor: "#EAF9FA",
  },

  dayCellToday: {
    backgroundColor: "#22BEC8",
  },

  dayLetter: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 4,
  },

  dayLetterToday: {
    color: "rgba(255,255,255,0.85)",
  },

  dayNumberWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: "#122A4E",
  },

  dayNumberToday: {
    color: "#FFFFFF",
  },

  dayDot: {
    marginTop: 4,
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D3DAE6",
  },

  dayDotFilled: {
    backgroundColor: "#22BEC8",
  },

  dayDotToday: {
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#122A4E",
  },

  sectionCount: {
    backgroundColor: "#EAF9FA",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    overflow: "hidden",
  },

  sectionCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#22BEC8",
  },

  teachersRow: {
    flexDirection: "row",
  },

  teacherCard: {
    width: 130,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#0D2A52",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  teacherPhotoWrap: {
    width: 62,
    height: 62,
    borderRadius: 999,
    borderWidth: 2.5,
    padding: 2,
    marginBottom: 10,
  },

  teacherPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  teacherName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#122A4E",
    textAlign: "center",
  },

  subjectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },

  subjectPillText: {
    fontSize: 11,
    fontWeight: "800",
  },

  sessionsCount: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 6,
  },

  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  sessionDateRail: {
    width: 52,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 12,
  },

  sessionDay: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  sessionDateNum: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 1,
  },

  sessionBody: {
    flex: 1,
  },

  sessionPhotoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sessionPhoto: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 10,
  },

  sessionTeacherName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#122A4E",
  },

  sessionSubjectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  sessionSubjectDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 6,
  },

  sessionSubject: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  sessionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },

  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },

  metaChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  emptyLabel: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    paddingVertical: 20,
  },
});

export default S;
