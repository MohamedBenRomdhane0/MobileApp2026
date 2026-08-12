import { StyleSheet } from "react-native";

const BG = "#0B1B33";
const SURFACE = "rgba(255,255,255,0.08)";
const SURFACE_STRONG = "rgba(255,255,255,0.12)";
const TEXT = "#F1F5F9";
const SUB = "rgba(241,245,249,0.55)";
const CYAN = "#22BEC8";
const GOLD = "#F6C445";
const BORDER = "rgba(255,255,255,0.10)";

export const customizeAvatarStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerBtnSave: {
    backgroundColor: CYAN,
  },

  headerTitle: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: SUB,
    fontWeight: "700",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  nameText: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT,
  },

  nameEditBtn: {
    marginLeft: 8,
    padding: 4,
  },

  nameInput: {
    minWidth: 140,
    maxWidth: 220,
    fontSize: 28,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    backgroundColor: SURFACE_STRONG,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: CYAN,
  },

  heroPreview: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: SURFACE,
  },

  heroImage: {
    width: "100%",
    height: 420,
  },

  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 36,
    backgroundColor: "rgba(11,27,51,0.55)",
  },

  heroLevel: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },

  heroItemName: {
    fontSize: 14,
    color: SUB,
    marginLeft: 8,
    fontWeight: "500",
  },

  heroLevelLine: {
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 18,
    marginHorizontal: 20,
  },

  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: SURFACE,
  },

  tabPillActive: {
    backgroundColor: CYAN,
  },

  tabPillText: {
    fontSize: 13,
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
    marginTop: 18,
    gap: 12,
  },

  gridItem: {
    width: "30%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    padding: 10,
    alignItems: "center",
  },

  gridItemSelected: {
    borderColor: GOLD,
  },

  gridItemLocked: {
    opacity: 0.5,
  },

  gridThumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },

  gridName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
  },

  gridRarity: {
    marginTop: 2,
    fontSize: 10,
    letterSpacing: 0.6,
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
    marginTop: 22,
    marginBottom: 28,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B1B33",
  },
});
