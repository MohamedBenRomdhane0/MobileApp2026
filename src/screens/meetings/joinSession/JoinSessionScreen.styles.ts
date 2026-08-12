import { StyleSheet } from "react-native";

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07101E",
  },

  headerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    marginTop: 2,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34,190,200,0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#22BEC8",
  },

  liveText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7DE1E8",
  },

  content: {
    paddingHorizontal: 20,
  },

  connecting: {
    alignItems: "center",
    paddingVertical: 90,
  },

  connectingText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 18,
  },

  connectingSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    marginTop: 6,
  },

  mainTile: {
    marginTop: 18,
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#0F1C30",
  },

  mainTileImg: {
    width: "100%",
    height: "100%",
  },

  mainOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(3,10,22,0.55)",
  },

  mainTopRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,90,103,0.85)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  liveTagDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  liveTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  camOffTag: {
    backgroundColor: "rgba(255,90,103,0.85)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teacherName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  teacherSubjectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34,190,200,0.22)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  teacherSubjectDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#22BEC8",
  },

  teacherSubjectText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7DE1E8",
  },

  peersRow: {
    flexDirection: "row",
    marginTop: 16,
  },

  peerTile: {
    width: 96,
    marginRight: 10,
  },

  peerImgWrap: {
    height: 92,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0F1C30",
  },

  peerImg: {
    width: "100%",
    height: "100%",
  },

  peerName: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: 6,
  },

  infoCard: {
    marginTop: 20,
    backgroundColor: "#0F1C30",
    borderRadius: 20,
    padding: 16,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },

  infoChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },

  dock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  dockBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  dockBtnOff: {
    backgroundColor: "rgba(255,90,103,0.20)",
    borderColor: "rgba(255,90,103,0.45)",
  },

  leaveBtn: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5A67",
  },
});

export default S;
