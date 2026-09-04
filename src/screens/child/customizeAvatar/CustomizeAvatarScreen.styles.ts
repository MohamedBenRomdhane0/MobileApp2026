import { StyleSheet } from "react-native";

const BG = "#0F2240";
const SURFACE = "rgba(255,255,255,0.10)";
const SURFACE_STRONG = "rgba(255,255,255,0.15)";
const TEXT = "#F1F5F9";
const SUB = "rgba(241,245,249,0.60)";
const CYAN = "#22BEC8";
const GOLD = "#F6C445";
const BORDER = "rgba(255,255,255,0.12)";

export const customizeAvatarStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: 25,
  },

  headerGlowA: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(34,190,200,0.15)",
    top: -110,
    left: -80,
  },

  headerGlowB: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -160,
    right: -100,
  },

  headerGlowC: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(246,196,69,0.10)",
    top: 60,
    right: -40,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerBtnSave: {
    backgroundColor: CYAN,
  },

  headerTitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: SUB,
    fontWeight: "700",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
  },

  nameEditBtn: {
    marginLeft: 6,
    padding: 3,
  },

  nameInput: {
    minWidth: 120,
    maxWidth: 200,
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    backgroundColor: SURFACE_STRONG,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: CYAN,
  },

  heroPreview: {
    marginTop: -8,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: SURFACE,
  },

  heroImage: {
    width: "100%",
    height: 340,
  },

  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 6,
    paddingTop: 10,
    backgroundColor: "rgba(11,27,51,0.55)",
  },

  heroLevel: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },

  heroItemName: {
    fontSize: 13,
    color: SUB,
    marginLeft: 6,
    fontWeight: "500",
  },

  heroLevelLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: SURFACE,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  pointsText: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginHorizontal: 20,
  },

  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: SURFACE,
  },

  tabPillActive: {
    backgroundColor: CYAN,
  },

  tabPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: SUB,
  },

  tabPillTextActive: {
    color: "#0B1B33",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },

  gridItem: {
    width: "30%",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    padding: 8,
    alignItems: "center",
  },

  gridItemSelected: {
    borderColor: GOLD,
  },

  gridItemLocked: {
    opacity: 0.5,
  },

  gridThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  gridName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "700",
    color: TEXT,
  },

  gridRarity: {
    marginTop: 2,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: SUB,
  },

  rarityEpic: { color: "#C084FC" },
  rarityRare: { color: "#60A5FA" },
  rarityCommon: { color: "#94A3B8" },
  rarityLegendary: { color: "#F6C445" },
  rarityLocked: { color: "#64748B" },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  },

  emptyStateText: {
    fontSize: 14,
    color: SUB,
    fontWeight: "600",
  },

  saveBtn: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 20,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B1B33",
  },
});
