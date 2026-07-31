import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { alignItems: "center", paddingRight: 2 },
  column: { alignItems: "center" },

  avatarWrap: { position: "relative", marginBottom: 2 },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#fff",
  },

  initials: {
    width: 40,
    height: 40,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  initialsText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  femaleBg: { backgroundColor: "#F9A8D4" },
  maleBg: { backgroundColor: "#93C5FD" },

  name: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    maxWidth: 90,
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "limegreen",
    position: "absolute",
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: "#fff",
  },
});