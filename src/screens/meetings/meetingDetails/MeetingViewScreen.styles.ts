import { StyleSheet, Dimensions } from "react-native";

const { width: W } = Dimensions.get("window");

export const COLORS = {
  bg: "#F8F9FF",
  heroCard: "#EAE8FF",
  orbOuter: "rgba(255,255,255,0.35)",
  orbMid: "rgba(255,255,255,0.55)",
  orbInner: "#FFFFFF",
  title: "#1D3B65",
  muted: "#6B7280",
  primary: "#22BEC8",
  orange: "#F97316",
  dark: "#111827",
  inputBg: "#F3F4F6",
  pillBg: "#F3F4F6",
  sendBtn: "#1D3B65",
};

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
  },
  headerBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: COLORS.title },

  scroll: { paddingHorizontal: 16, paddingBottom: 40 },

  // ── Hero card ──────────────────────────────────────────────────────────────
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#7C6FCD", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  star: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  heroTopRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.6)",
  },
  filterBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },

  // ── Orb (glowing liquid knot, SVG) ───────────────────────────────────────────
  orbContainer: { width: 160, height: 160, alignItems: "center", justifyContent: "center", marginVertical: 6 },
  orbPulseGlow: {
    position: "absolute",
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#FFFFFF", shadowOpacity: 1, shadowRadius: 30, shadowOffset: { width: 0, height: 0 },
  },

  greetingBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    marginTop: 6,
  },
  heroGreeting: {
    fontSize: 14, fontWeight: "600", color: "#FFFFFF",
    textAlign: "left",
  },

  actionRow: {
    flexDirection: "row", alignItems: "center",
    gap: 20,
  },
  actionBtn: {
    width: 50, height: 50, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  micBtn: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: COLORS.dark,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // ── Prompts row ───────────────────────────────────────────────────────────
  promptsRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  promptsLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  promptsText: { fontSize: 12.5, fontWeight: "700", color: COLORS.title },
  poweredText: { fontSize: 11.5, fontWeight: "600", color: COLORS.muted },

  // ── Input bar ─────────────────────────────────────────────────────────────
  inputBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, color: COLORS.title, padding: 0 },
  sendBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: COLORS.sendBtn,
    alignItems: "center", justifyContent: "center",
  },

  // ── Pills ─────────────────────────────────────────────────────────────────
  pillsScroll: { marginBottom: 20 },
  pillsRow: { flexDirection: "row", gap: 8, paddingRight: 4 },
  pillActive: {
    paddingHorizontal: 18, height: 36, borderRadius: 999,
    backgroundColor: COLORS.dark,
    alignItems: "center", justifyContent: "center",
  },
  pillActiveText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  pill: {
    paddingHorizontal: 16, height: 36, borderRadius: 999,
    backgroundColor: COLORS.pillBg,
    alignItems: "center", justifyContent: "center",
  },
  pillText: { fontSize: 13, fontWeight: "600", color: COLORS.title },

  // ── Roadmap ───────────────────────────────────────────────────────────────
  roadmapSection: {},
  roadmapHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  roadmapTitle: { fontSize: 18, fontWeight: "900", color: COLORS.title },
  roadmapTabs: { flexDirection: "row", gap: 4 },
  roadmapTab: { paddingHorizontal: 8, paddingVertical: 4 },
  roadmapTabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.title },
  roadmapTabText: { fontSize: 12, fontWeight: "600", color: COLORS.muted },
  roadmapTabTextActive: { color: COLORS.title, fontWeight: "800" },

  ganttContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ganttRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    marginBottom: 4,
  },
  ganttLabelCol: {
    width: 140,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ganttDot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#1D3B65",
  },
  ganttLabel: { fontSize: 12, fontWeight: "700", color: COLORS.title, flex: 1 },
  ganttBarArea: {
    flex: 1,
    height: 28,
    position: "relative",
  },
  ganttBar: {
    position: "absolute",
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  progressBadge: {
    position: "absolute",
    top: -10,
    left: 6,
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  progressText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },
  ganttAvatar: {
    position: "absolute",
    top: -6,
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: "#FFFFFF",
    overflow: "hidden",
  },

  // ── Timeline ──────────────────────────────────────────────────────────────
  timeline: {
    flexDirection: "row",
    marginTop: 8,
    paddingLeft: 140,
  },
  timelineDay: { flex: 1, alignItems: "center", position: "relative" },
  timelineDayText: { fontSize: 11, fontWeight: "600", color: COLORS.muted },
  timelineDayActive: { color: COLORS.title, fontWeight: "800" },
  timelineLine: {
    position: "absolute",
    top: -172,
    width: 2,
    height: 172,
    backgroundColor: COLORS.orange,
    opacity: 0.4,
    borderRadius: 1,
  },
});
